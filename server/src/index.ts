import 'dotenv/config';
import 'tsconfig-paths/register';
import express from 'express';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

import connectDB from './db';
import socketHandlers from './lib/socket';

import authRoutes from './route/auth';
import chatRoutes from './route/chat';

// Initializations
const app = express();
const server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app);
const ws = new Server(server, { cors: { origin: '*' } });
connectDB();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 10 minutes',
  headers: true,
});

// Middlewares
app.use(cors());
app.use(limiter);
app.use(express.json());

// Routes
app.get('/', (req, res) => { res.send('Ping!') });
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// Websockets
ws.on('connection', (socket) => {
  console.log('A user connected!');
  socketHandlers(socket);
});

// Start server
const PORT = process.env.PORT || 42069;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});