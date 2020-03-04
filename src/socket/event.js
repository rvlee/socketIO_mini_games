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

  socket.on('roomOptions', (roomOptions) => {
    setGlobalValues((state) => { 
      return {
        ...state,
        room: roomOptions.room,
        playerId: roomOptions.order,
        pageType: 'GAME',
        gameType: roomOptions.game,
      }
    })
  })
}