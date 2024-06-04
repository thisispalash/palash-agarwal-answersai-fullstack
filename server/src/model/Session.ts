import { Schema, model, Document } from 'mongoose';

export interface ISession extends Document {
  userId: string;
  token: string;
  start: Date;
  end: Date;
}

const SessionSchema = new Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const Session = model<ISession>('Session', SessionSchema);

export default Session;