import io from "socket.io-client";
import socketEvents from './event';
const localUrl = 'ws://localhost:3000';
export const socket = io('', {transports: ['websocket']});

export const initSockets = (setGlobalValues) => {
  socketEvents(setGlobalValues);
}