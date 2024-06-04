import { Schema, model, Document } from 'mongoose';
import { ISession } from './Session';

export interface IUser extends Document {
  email: string;
  password: string;
  sessions: Array<ISession>;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessions: [{ type: Schema.Types.ObjectId, ref: 'Session'}],
});

const User = model<IUser>('User', UserSchema);

export default User;