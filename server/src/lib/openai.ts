import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { TiktokenModel, encoding_for_model } from 'tiktoken';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET,
});

export function tokenize(text: string, model: string) {
  const enc = encoding_for_model(model as TiktokenModel);
  const tokens = enc.encode(text);
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