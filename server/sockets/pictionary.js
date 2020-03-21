const pictionarySocket = (io, socket, rooms) => {
  socket.on('drawing', (room, drawingInfo) => {
    socket.to(room).emit('drawing', drawingInfo)
  })

  socket.on('win', (room, name) => {
    socket.to(room).emit('win')
    io.in(room).emit('chatMessage', room, `Player ${name} has won`, 'SYSTEM')
  })

  socket.on('pictionaryStart', (room) => {
    io.in(room).emit('pictionaryStart')
  })

}


module.exports = pictionarySocket