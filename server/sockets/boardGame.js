const boardGameSocket = (io, socket, rooms) => {
  socket.on('move', function(room, x, y) {
    console.log("Listen Move")
    socket.to(room).emit('move', x, y)
  })
}

module.exports = boardGameSocket