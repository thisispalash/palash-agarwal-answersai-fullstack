import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';
import { IMessage } from './Message';


export interface IChat extends Document {
  user: IUser;
  modelname: string;
  messages: Array<IMessage>;
  tokens?: number;
  timestamp: Date;
}

const ChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  modelname: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  tokens: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

const Chat = model<IChat>('Chat', ChatSchema);

export default Chat;