const optionUtil = require('../utils/optionUtil');
const commonUtils = require('../utils/common');

const common = (io, socket, rooms) => {
    // Need to change join room to createRoom
  socket.on('createRoom', function(name, room, game, gameOptions, options) {
    socket.join(room);
    rooms[room] = {
      room,
      playerTurn: 0,
      playerList: [],
      playerInfo: {
        [name]: {
          score: 0
        }
      },
      game,
      message: [],
      timerInterval: [],
    }
    rooms[room].playerList.push(name);
    rooms[room] = optionUtil.getGameOptions(game, rooms[room], gameOptions, options);
    // true should be the users name
    
    socket.emit('playerOrder', 0, rooms[room])
    io.in(room).emit('playerList', rooms[room].playerList, rooms[room].playerInfo)
  });

  socket.on('joinRoom', function(name, room, options) {
    socket.join(room);
    rooms[room].playerList.push(name);
    rooms[room].playerInfo[name] = {
      score: 0
    }

    rooms[room] = optionUtil.setGameOptions(rooms[room], options)

    const roomOptions = optionUtil.getRoomOptions(rooms[room], options)
    io.in(room).emit('gameOptions', rooms[room].gameOptions)
    io.in(room).emit('playerList', rooms[room].playerList, rooms[room].playerInfo)
    socket.emit('roomOptions', roomOptions)
  })

  socket.on('disconnectRoom', (room) => {
    if (rooms[room] && rooms[room].playerList) {
      delete rooms[room];
      socket.to(room).emit('playerLeft')
    }
  })

  socket.on('changePlayer', (room) => {
    commonUtils.emitChangePlayer(io, rooms, room);
  })

  socket.on('restart', (room) => {
    socket.to(room).emit('restart')
  })

}

module.exports = common