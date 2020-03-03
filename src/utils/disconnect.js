import { socket } from '../socket/socket';

export default () => {
  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    socket.emit('disconnectRoom', 'room1');
  });
}