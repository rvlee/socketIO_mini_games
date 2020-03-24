const commonUtils = require('../utils/common');

const pictionarySocket = (io, socket, rooms) => {
  socket.on('drawing', (room, drawingInfo) => {
    socket.to(room).emit('drawing', drawingInfo)
  })

  socket.on('win', (room, name) => {
    clearInterval(rooms[room].timerInterval)
    rooms[room].timerInterval = [];

    rooms[room].playerInfo[rooms[room].playerList[rooms[room].playerTurn]].score = rooms[room].playerInfo[rooms[room].playerList[rooms[room].playerTurn]].score + 2;
    rooms[room].playerInfo[name].score = rooms[room].playerInfo[name].score + 1;
    socket.to(room).emit('win')
    io.in(room).emit('chatMessage', room, `Player ${name} has won`, 'SYSTEM')
    io.in(room).emit('playerList', rooms[room].playerList, rooms[room].playerInfo)
    io.in(room).emit('timer', '-')
  })

  socket.on('pictionaryStart', (room, shouldStartTimer) => {
    io.in(room).emit('pictionaryStart')
    let timeRemaining = 240;
    if (shouldStartTimer) {
      rooms[room].timerInterval = setInterval(() => {
          io.in(room).emit('timer', timeRemaining)
          if (timeRemaining < 0 ) {
            clearInterval(rooms[room].timerInterval)
            io.in(room).emit('pictionaryStart')
            commonUtils.emitChangePlayer(io, rooms, room);
            io.in(room).emit('chatMessage', room, `NO WINNER`, 'SYSTEM')
            io.in(room).emit('timer', '-')
          }
          timeRemaining = timeRemaining - 1;
      }, 1000)
    }
  })
}


module.exports = pictionarySocket