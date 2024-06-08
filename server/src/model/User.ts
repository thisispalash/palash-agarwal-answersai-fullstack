import { Schema, model, Document } from 'mongoose';
import { ISession } from './Session';

export interface IUser extends Document {
  email: string;
  password: string;
  sessions: Array<ISession>;
  usage: {
    date: Date;
    tokens: number;
  };
  isThrottled: boolean;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessions: [{ type: Schema.Types.ObjectId, ref: 'Session'}],
  usage: {
    date: { type: Date, default: Date.now },
    tokens: { type: Number, default: 0 }
  },
  isThrottled: { type: Boolean, default: false }
});

const User = model<IUser>('User', UserSchema);

export default User;