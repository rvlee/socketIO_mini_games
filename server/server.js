const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const optionUtil = require('./utils/optionUtil');

const PORT = process.env.PORT || 3000;

let rooms = {}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, '../dist')))

app.get('/rooms', (req, res) => {
  res.send(JSON.stringify(rooms))
})

io.on("connection", function(socket) {
  const { id } = socket.client;

  console.log("user connected");
  socket.emit("welcome", "welcome man");

  // Need to change join room to createRoom
  socket.on('createRoom', function(name, room, game, gameOptions, options) {
    socket.join(room);
    rooms[room] = {
      room,
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

  socket.on('move', function(room, x, y) {
    console.log("Listen Move")
    socket.to(room).emit('move', x, y)
  })

  socket.on('disconnectRoom', (room) => {
    if (rooms[room] && rooms[room].playerList) {
      delete rooms[room];
      socket.to(room).emit('playerLeft')
    }
  })

  socket.on('restart', (room) => {
    rooms[room].playerList = [];
    socket.to(room).emit('restart')
  })

  socket.on('chatMessage', (room, msg, name) => {
    console.log(name);
    rooms[room].message.push({
      name,
      msg
    })
    socket.to(room).emit('chatMessage', room, msg, name)
  })

});

server.listen(PORT);

