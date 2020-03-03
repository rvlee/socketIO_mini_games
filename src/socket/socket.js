import io from "socket.io-client";
import socketEvents from './event';
export const socket = io('ws://localhost:3000', {transports: ['websocket']});

export const initSockets = (setGlobalValues) => {
  socketEvents(setGlobalValues);
}