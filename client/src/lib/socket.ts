import io, { Socket } from 'socket.io-client';

export function startSocket(_id: string) {
  const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'wss://localhost:42069');
  socket.on('connect', () => console.log('Connected to server!'));
  socket.emit('join', _id);
  return socket;
}

export function stopSocket(socket: Socket, _id: string) {
  if (!socket) return;
  socket.emit('leave', _id);
  socket.disconnect();
  socket.on('disconnect', () => console.log('Disconnected from server!'));
}