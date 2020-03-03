import { socket } from './socket';

export const emitMove = ({room, x, y}) => {
  socket.emit('move', room, x, y)
}

export const emitJoinRoom = ({room}) => {
  socket.emit('joinRoom', room);
}

export const emitDisconnect = ({room}) => {  
  socket.emit('disconnectRoom', room);
}

export const emitRestartRoom = ({room}) => {
  socket.emit('restart', room);
}