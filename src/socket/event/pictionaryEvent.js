import { socket } from '../socket';

export default ({ onChangePlayerTurn, togglePictionaryGame }) => {
  // Listening stuff
  socket.on('changePlayer', (playerTurn) => {
    onChangePlayerTurn(playerTurn)
  })

  socket.on('pictionaryStart', () => {
    togglePictionaryGame()
  })
}