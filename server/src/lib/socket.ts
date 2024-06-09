import { Socket } from 'socket.io';
import Chat from '@/model/Chat';
import Message from '@/model/Message';

import { tokenize } from './openai';

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
  await chat.populate('messages');
  const reqMessage = new Message({ 
    role: 'user', 
    prompt, 
    tokens: tokenize(prompt, chat.modelname).count 
  });
  const history = chat.messages;
  history.push(reqMessage);

  // @todo call openai
}

export default function socketHandlers(socket: Socket) {

  socket.on('join', (_id) => joinChat(socket, _id));
  socket.on('prompt', ({ _id, prompt }) => chatPrompt(socket, _id, prompt));
  socket.on('leave', (_id) => leaveChat(socket, _id));
  socket.on('disconnect', () => console.log('Disconnected from client!'));

}