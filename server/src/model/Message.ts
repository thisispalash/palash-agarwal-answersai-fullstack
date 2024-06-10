import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  role: string;
  content: string;
  tokens: number;
}

const MessageSchema = new Schema({
  role: { type: String, required: true },
  content: { type: String, required: true },
  tokens: { type: Number, default: 0 },
});

const Message = model<IMessage>('Message', MessageSchema);

export default Message;