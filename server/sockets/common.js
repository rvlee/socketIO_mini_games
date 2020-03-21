const optionUtil = require('../utils/optionUtil');

const common = (io, socket, rooms) => {
    // Need to change join room to createRoom
  socket.on('createRoom', function(name, room, game, gameOptions, options) {
    socket.join(room);
    rooms[room] = {
      room,
      playerTurn: 0,
      playerList: [],
      game,
      message: []
    }
    rooms[room].playerList.push(name);
    rooms[room] = optionUtil.getGameOptions(game, rooms[room], gameOptions, options);
    // true should be the users name
    
    socket.emit('playerOrder', 0, rooms[room])
    io.in(room).emit('playerList', rooms[room].playerList)
  });

  socket.on('joinRoom', function(name, room, options) {
    socket.join(room);
    rooms[room].playerList.push(name);
    rooms[room] = optionUtil.setGameOptions(rooms[room], options)

    const roomOptions = optionUtil.getRoomOptions(rooms[room], options)
    io.in(room).emit('gameOptions', rooms[room].gameOptions)
    io.in(room).emit('playerList', rooms[room].playerList)
    socket.emit('roomOptions', roomOptions)
  })

  socket.on('disconnectRoom', (room) => {
    if (rooms[room] && rooms[room].playerList) {
      delete rooms[room];
      socket.to(room).emit('playerLeft')
    }
  })

  socket.on('changePlayer', (room) => {
    rooms[room].playerTurn = rooms[room].playerTurn + 1;
    if (rooms[room].playerTurn > rooms[room].playerList.length - 1) {
      rooms[room].playerTurn = 0
    }
    io.in(room).emit('changePlayer', rooms[room].playerTurn)
  })

  socket.on('restart', (room) => {
    socket.to(room).emit('restart')
  })

}

module.exports = common