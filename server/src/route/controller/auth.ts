import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '@/model/User';
import Session from '@/model/Session';

const jwt_secret = process.env.JWT_SECRET || 'my-jwt-secret';

export const checkUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User found' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body; /// @dev: password is plaintext; @todo: transfer salt over network
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    // TODO: send email verification
    return res.status(201).json({ message: 'User created' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body; /// @dev: password is plaintext; @todo: transfer salt over network
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ email }, jwt_secret, { expiresIn: '24h' });
    const decode = jwt.decode(token) as { iat: number, exp: number };
    /// @note `iat` and `exp` are in seconds, so we multiply by 1000 to get ms

    const session = new Session({
      userId: user._id,
      token,
      start: new Date(decode.iat * 1000),
      end: new Date(decode.exp * 1000),
    });
    user.sessions.push(session);
    
    await session.save();
    await user.save();
    
    return res.status(200).json({ token, exp: decode.exp * 1000 });
  } catch (err: any) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

export const session = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const session = await Session.findOne({ token });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const now = new Date();
    if (now > session.end) return res.status(401).json({ message: 'Session expired' });

    return res.status(200).json({ message: 'Session valid' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

/// @dev to be used as a middleware fn to protect routes
export const verifyJWT = async (req: Request, res: Response, next: any) => {
  if (!req.headers.authorization) 
    return res.status(401).json({ message: 'No token provided' });
  const auth = req.headers.authorization as string;
  const token = auth.split(' ')[1];
  try {
    jwt.verify(token, jwt_secret);
    next();
  } catch (err: any) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}