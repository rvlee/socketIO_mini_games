const commonUtils = require('../utils/common');

const pictionarySocket = (io, socket, rooms) => {
  socket.on('drawing', (room, drawingInfo) => {
    socket.to(room).emit('drawing', drawingInfo)
  })

  socket.on('win', (room, name) => {
    rooms[room].playerInfo[rooms[room].playerList[rooms[room].playerTurn]].score = rooms[room].playerInfo[rooms[room].playerList[rooms[room].playerTurn]].score + 2;
    rooms[room].playerInfo[name].score = rooms[room].playerInfo[name].score + 1;
    socket.to(room).emit('win')
    io.in(room).emit('chatMessage', room, `Player ${name} has won`, 'SYSTEM')
    io.in(room).emit('playerList', rooms[room].playerList, rooms[room].playerInfo)
  })

  socket.on('pictionaryStart', (room) => {
    let timeRemaining = 240;
    io.in(room).emit('pictionaryStart')
    const timerInterval = setInterval(() => {
        io.in(room).emit('timer', timeRemaining)
        if (timeRemaining < 0) {
          clearInterval(timerInterval)
          io.in(room).emit('pictionaryStart')
          commonUtils.emitChangePlayer(io, rooms, room);
          io.in(room).emit('chatMessage', room, `NO WINNER`, 'SYSTEM')
          io.in(room).emit('timer', '-')
        }
        timeRemaining = timeRemaining - 1;
    }, 1000);
  })
  
}


module.exports = pictionarySocket