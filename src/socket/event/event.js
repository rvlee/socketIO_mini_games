import { socket } from '../socket';

export default (setGlobalValues) => {
  // Listening stuff
  socket.on('playerOrder', (playerId, gameInfo) => {
    setGlobalValues((state) => { 
      return {
        ...state,
        playerId,
        gameOptions: gameInfo.gameOptions,
        playerTurn: gameInfo.playerTurn
      }
    })
  })

  socket.on('roomOptions', (roomOptions) => {
    setGlobalValues((state) => { 
      return {
        ...state,
        room: roomOptions.room,
        playerTurn: roomOptions.playerTurn,
        playerId: roomOptions.order,
        pageType: 'GAME',
        gameType: roomOptions.game,
        color: roomOptions.color,
      }
    })
  })

  socket.on('gameOptions', (gameOptions) => {
    setGlobalValues((state) => { 
      return {
        ...state,
        gameOptions: gameOptions
      }
    })
  })

  socket.on('playerList', (playerList, playerInfo) => {
    setGlobalValues((state) => {
      return {
        ...state,
        playerList,
        playerInfo
      }
    })
  })

  socket.on('changePlayer', (playerTurn) => {
    setGlobalValues((state) => {
      return {
        ...state,
        playerTurn
      }
    })
  })
}