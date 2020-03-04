import { socket } from './socket';

export const emitMove = ({room, x, y}) => {
  socket.emit('move', room, x, y)
}

export const emitCreateRoom = ({name, room, game}) => {
  socket.emit('createRoom', name, room, game);
}

export const emitJoinRoom = ({name, room}) => {
  socket.emit('joinRoom', name, room);
}

export const emitDisconnect = ({room}) => {  
  socket.emit('disconnectRoom', room);
}

export const emitRestartRoom = ({room}) => {
  socket.emit('restart', room);
}

export const emitSendMessage = ({room, message, id}) => {
  socket.emit('chatMessage', room, message, id);
}