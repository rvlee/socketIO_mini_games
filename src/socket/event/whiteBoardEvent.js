import { socket } from '../socket';

export default ({ drawLine }) => {
  socket.on('drawing', ({
    color,
    prevX,
    prevY,
    currX,
    currY
  }) => {
    drawLine(prevX, prevY, currX, currY, color, true);
  })
}