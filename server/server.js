const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

let rooms = {}

app.use(express.static(path.join(__dirname, '../dist')))

io.on("connection", function(socket) {
  console.log("user connected");
  socket.emit("welcome", "welcome man");

  socket.on('joinRoom', function(room) {
    socket.join(room);
    if (rooms[room] === undefined) {
      rooms[room] = {
        list: []
      }
    }  
    rooms[room].room = room;
    rooms[room].list.push(socket);
    socket.emit('playerOrder', rooms[room].list.length - 1)
  });

  socket.on('move', function(room, x, y) {
    socket.to(room).emit('move', x, y)
  })

  socket.on('disconnectRoom', (room) => {
    if (rooms[room] && rooms[room].list) {
      rooms[room].list = [];
      socket.to(room).emit('playerLeft')
    }
  })

  socket.on('restart', (room) => {
    rooms[room].list = [];
    socket.to(room).emit('restart')
  })
});

server.listen(PORT);

