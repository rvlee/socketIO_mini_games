const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const pictionarySocket = require('./sockets/pictionary');
const commonSocket = require('./sockets/common');
const chatSocket = require('./sockets/chat');
const boardGameSocket = require('./sockets/boardGame');

const wordBank = require('./wordBank');

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

app.get('/prompt', (req, res) => {
  let prompt = {
    prompt: wordBank[Math.floor(Math.random() * wordBank.length)]
  }
  res.send(JSON.stringify(prompt))
})

io.on("connection", function(socket) {
  const { id } = socket.client;

  console.log("user connected");
  socket.emit("welcome", "welcome man");

  // Common
  commonSocket(io,socket, rooms);

  // Chat
  chatSocket(io, socket, rooms);

  // Board Game Ex (tic tac toe, connect four etc..)
  boardGameSocket(io, socket, rooms);

  // Pictionary
  pictionarySocket(io, socket, rooms);
});

server.listen(PORT);

