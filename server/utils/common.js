const emitChangePlayer = (io, rooms, room) => {
  rooms[room].playerTurn = rooms[room].playerTurn + 1;
  if (rooms[room].playerTurn > rooms[room].playerList.length - 1) {
    rooms[room].playerTurn = 0
  }
  io.in(room).emit('changePlayer', rooms[room].playerTurn)
}

module.exports = {
  emitChangePlayer
}