import { socket } from './socket';

export default ({onMessage}) => {
  // Listening stuff
  socket.on('chatMessage', (room, msg, name) => {
    onMessage(room, msg, name)
  })

}