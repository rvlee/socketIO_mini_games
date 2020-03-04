import { socket } from '../socket/socket';

export default (room) => {
  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    socket.emit('disconnectRoom', room);
  });
}