import { Server } from 'socket.io';
export let io;

export function initIO(server){
  io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket)=>{
    socket.on('identify', ({ userId })=> socket.join(String(userId)));
  });
  return io;
}
