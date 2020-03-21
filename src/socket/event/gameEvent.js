import { socket } from '../socket';

export default ({winEvent, startGame, handleClick, restartGame}) => {
  // Listening stuff
  socket.on('move', (x, y) => {
    handleClick(x, y);
  })

  socket.on('restart', () => {
    startGame();
  })

  socket.on('playerLeft', () => {
    restartGame();
  })

  socket.on('win', () => {
    winEvent();
  })
}