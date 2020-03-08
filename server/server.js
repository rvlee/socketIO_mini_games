const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

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
  socket.on('createRoom', function(name, room, game, gameOptions) {
    socket.join(room);
    if (rooms[room] === undefined) {
      rooms[room] = {
        room,
        list: [],
        game,
        gameOptions,
        message: []
      }
    }
    // true should be the users name
    rooms[room].list.push(name);
    socket.emit('playerOrder', rooms[room].list.length - 1)
  });

  socket.on('joinRoom', function(name, room) {
    socket.join(room);
    const roomInfo = rooms[room]
    rooms[room].list.push(name);  
    const roomOptions = {
      name,
      room,
      game: roomInfo.game,
      gameOptions: roomInfo.gameOptions,
      order: rooms[room].list.length - 1
    }
    socket.emit('roomOptions', roomOptions)
  })

  socket.on('move', function(room, x, y) {
    console.log("Listen Move")
    socket.to(room).emit('move', x, y)
  })

  socket.on('disconnectRoom', (room) => {
    if (rooms[room] && rooms[room].list) {
      delete rooms[room];
      socket.to(room).emit('playerLeft')
    }
  })

  socket.on('restart', (room) => {
    rooms[room].list = [];
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

