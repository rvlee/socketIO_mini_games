import { socket } from '../socket';

export default ({ onChangePlayerTurn, togglePictionaryGame, setTimer }) => {
  // Listening stuff
  socket.on('changePlayer', (playerTurn) => {
    onChangePlayerTurn(playerTurn)
  })

  socket.on('pictionaryStart', () => {
    togglePictionaryGame()
  })

  socket.on('timer', (timeRemaining) => {
    setTimer(timeRemaining)
  })

}