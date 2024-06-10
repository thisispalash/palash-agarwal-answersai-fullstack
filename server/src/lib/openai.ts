import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { TiktokenModel, encoding_for_model } from 'tiktoken';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET,
});

function getTokenizable(text: string, role: 'user' | 'assistant' | 'system') {
  switch (role) {
    case 'user': return `%user%${text}% %assistant%`;
    case 'assistant': return `${text}%`;
    case 'system': return `%system%${text}%`;
  }
}

export function tokenizeText(text: string, model: string) {
  const enc = encoding_for_model(model as TiktokenModel);
  const tokens = enc.encode(text);
  enc.free();
  return { count: tokens.length, tokens };
}

export function tokenize(text: string, model: string, role: 'user' | 'assistant' | 'system') {
  const enc = encoding_for_model(model as TiktokenModel);
  /// @dev see https://community.openai.com/t/prompt-tokens-usage-seems-too-high/595970/2
  let to_tokenize = getTokenizable(text, role);
  const tokens = enc.encode(to_tokenize);
  enc.free();
  return { count: tokens.length, tokens };
}

export function tokenizeHistory(model: string, history: { role: string, content: string }[]) {
  const enc = encoding_for_model(model as TiktokenModel);
  let to_tokenize = '';
  history.forEach( (msg, i) => {
    to_tokenize += getTokenizable(msg.content, msg.role as 'user' | 'assistant' | 'system');
    if (i < history.length - 1) to_tokenize += ' ';
  });
  const tokens = enc.encode(to_tokenize);
  enc.free();
  return { count: tokens.length, tokens };
}

export async function openaiChat(
  model: string, 
  history: { role: string, content: string }[]
) {
  const completion = await openai.chat.completions.create({
    model,
    messages: history as ChatCompletionMessageParam[],
  });
  const reply = completion.choices[0].message.content;
  if (!reply) {
    throw new Error('No reply from OpenAI');
  }

  const usage = completion.usage;
  return { reply, usage };
}