import OpenAI from 'openai';
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