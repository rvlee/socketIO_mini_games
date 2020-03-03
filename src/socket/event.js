import { socket } from './socket';

export default (setGlobalValues) => {
  // Listening stuff
  socket.on('playerOrder', (playerId) => {
    setGlobalValues((state) => { 
      return {
        ...state,
        playerId,
      }
    })
  })
}