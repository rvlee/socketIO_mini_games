const chatSocket = (io, socket, rooms) => {
  socket.on('chatMessage', (room, msg, name) => {
    rooms[room].message.push({
      name,
      msg
    })
    socket.to(room).emit('chatMessage', room, msg, name)
  })
}

module.exports = chatSocket