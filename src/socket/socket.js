import io from "socket.io-client";
import socketEvents from './event/event';
let websocketUrl = ''
if (process.env.NODE_ENV === 'development') {
  websocketUrl = 'ws://localhost:3000';
}
export const socket = io(websocketUrl, {transports: ['websocket']});

export const initSockets = (setGlobalValues) => {
  socketEvents(setGlobalValues);
}