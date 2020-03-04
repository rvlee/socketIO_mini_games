import { socket } from './socket';

export default ({onMessage}) => {
  // Listening stuff
  socket.on('chatMessage', (room, msg, id) => {
    onMessage(room, msg, id)
  })

}