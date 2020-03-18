import { socket } from './socket';

export const emitMove = ({room, x, y}) => {
  socket.emit('move', room, x, y)
}

export const emitCreateRoom = ({name, room, game, color, gameOptions}) => {
  socket.emit('createRoom', name, room, game, gameOptions, {color});
}

export const emitJoinRoom = ({name, room, color}) => {
  socket.emit('joinRoom', name, room, {color});
}

export const emitDisconnect = ({room}) => {  
  socket.emit('disconnectRoom', room);
}

export const emitRestartRoom = ({room}) => {
  socket.emit('restart', room);
}

export const emitSendMessage = ({room, message, name}) => {
  socket.emit('chatMessage', room, message, name);
}