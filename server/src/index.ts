import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import connectDB from './db';

import authRoutes from './route/auth';


// Initializations
const app = express();
const server = http.createServer(app);
const ws = new Server(server);
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => { res.send('Ping!') });
app.use('/auth', authRoutes);

// Websockets
ws.on('connection', (socket) => {
  console.log('A user connected!');

  socket.on('disconnect', () => {
    console.log('A user disconnected!');
  });
});

// Start server
const PORT = process.env.PORT || 42069;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});