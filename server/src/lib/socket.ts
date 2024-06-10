import { Socket } from 'socket.io';
import Chat from '@/model/Chat';
import Message from '@/model/Message';

import { openaiChat, tokenize } from './openai';
import { checkThrottle, createUsageObject } from '@/route/controller/chat';

async function getChat(_id: string) {
  const chat = await Chat.findOne({ _id });
  if (!chat) {
    console.log(`Chat ${_id} not found!`);
    return null;
  }
  return chat;
}

async function joinChat(socket: Socket, _id: string) {
  const chat = await getChat(_id);
  if (!chat) {
    socket.emit('error', 'Chat not found!');
    return;
  }
  socket.join(_id);
  console.log(`Joined chat ${_id}`);
}

async function leaveChat(socket: Socket, _id: string) {
  const chat = await getChat(_id);
  if (!chat) {
    socket.emit('error', 'Chat not found!');
    return;
  }
  socket.leave(_id);
  console.log(`Left chat ${_id}`);
}

async function chatPrompt(socket: Socket, _id: string, prompt: string) {
  const chat = await getChat(_id);
  if (!chat) {
    socket.emit('error', 'Chat not found!');
    return;
  }
  console.log('chat exists!')
  /// check throttle
  await chat.populate('user');
  if (await checkThrottle(chat.user)) {
    socket.emit('error', 'User throttled! Exiting chat.');
    leaveChat(socket, _id);
    return;
  }
  console.log('not throttled!')
  /// get history
  const history = [];
  await chat.populate('messages');
  chat.messages.map( (msg) => history.push({ role: msg.role, content: msg.content }))
  history.push({ role: 'user', content: prompt });
  console.log('history:', history);
  /// call openai
  let reply, usage;
  try {
    const res = await openaiChat(chat.modelname, history);
    reply = res.reply;
    usage = res.usage;
  } catch (err) {
    socket.emit('error', 'OpenAI error!');
    return;
  }
  console.log('reply:', reply);
  console.log('usage:', usage);
  /// create and save messages
  const promptTokens = usage?.prompt_tokens ?? tokenize(prompt, chat.modelname).count;
  const assistantTokens = usage?.completion_tokens ?? tokenize(reply, chat.modelname).count;
  const userMessage = new Message({ 
    role: 'user', 
    content: prompt, 
    tokens: promptTokens
  });
  const assistantMessage = new Message({
    role: 'assistant',
    content: reply,
    tokens: assistantTokens
  });
  await userMessage.save();
  await assistantMessage.save();
  console.log('messages saved!');
  /// save chat
  chat.messages.push(userMessage);
  chat.messages.push(assistantMessage);
  chat.tokens += promptTokens + assistantTokens;
  await chat.save();
  console.log('chat saved!');
  /// update user tokens
  const lastUse = chat.user.usage[chat.user.usage.length - 1]; /// @dev this will always be today since it is added within `checkThrottle`
  lastUse.tokens += promptTokens + assistantTokens;
  chat.user.usage[chat.user.usage.length - 1] = lastUse;
  await chat.user.save();
  console.log('user saved!');
  /// finally, construct token usage and emit reply
  const tokenUsageToday = await createUsageObject(chat.user);
  socket.emit('reply', { reply, usage: tokenUsageToday });
}

export default function socketHandlers(socket: Socket) {

  socket.on('join', (_id) => joinChat(socket, _id));
  socket.on('prompt', ({ _id, prompt }) => chatPrompt(socket, _id, prompt));
  socket.on('leave', (_id) => leaveChat(socket, _id));
  socket.on('disconnect', () => console.log('Disconnected from client!'));

}