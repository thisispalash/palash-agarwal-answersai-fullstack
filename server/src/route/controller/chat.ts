import { Request, Response } from 'express';
import User from '@/model/User';
import Chat from '@/model/Chat';
import Message from '@/model/Message';
import { tokenize } from '@/lib/openai';

const DAILY_TOKEN_LIMIT = 10000;
const SYS_MESSAGE = 'You are a helpful assistant';

const throttleUser = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return false; /// @dev this should not happen
    user.isThrottled = true;
    await user.save();
    return true;
  } catch (err: any) {
    console.log('Error throttling user:', err.message);
    return false;
  }
}

export const getTokenUsage = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { usage } = user;
    const today = new Date();
    const ret = {
      pct: 0,
      limit: DAILY_TOKEN_LIMIT,
      actual: 0,
    }
    if (usage && usage.date.toDateString() === today.toDateString()) {
      ret.actual = usage.tokens;
      ret.pct = (usage.tokens / DAILY_TOKEN_LIMIT) * 100;
      ret.pct = Math.round((ret.pct + Number.EPSILON) * 100) / 100;
      if (ret.actual >= DAILY_TOKEN_LIMIT) {
        await throttleUser(email);
      }   
    }
    return res.status(200).json(ret);
  } catch (err: any) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

export const startChat = async (req: Request, res: Response) => {
  const { email, model } = req.body;
  console.log(`starting chat for ${email} with model ${model}.`);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const sysMessage = new Message({ 
      role: 'system', 
      content: SYS_MESSAGE,
      tokens: tokenize(SYS_MESSAGE, model).count,
    });
    await sysMessage.save();
    const chat = new Chat({ 
      user, 
      modelname: model, 
      messages: [sysMessage], 
      tokens: sysMessage.tokens 
    });
    await chat.save();
    return res.status(201).json({ _id: chat._id });
  } catch (err: any) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}
