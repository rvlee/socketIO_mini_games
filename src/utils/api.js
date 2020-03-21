import axios from 'axios';

let roomUrl = '/rooms';
let promptUrl = '/prompt';

if (process.env.NODE_ENV === 'development') {
  roomUrl = 'http://localhost:3000/rooms';
  promptUrl = 'http://localhost:3000/prompt';
}

export const getRooms = (cb) => {
  axios.get(roomUrl)
    .then((response) => {
      cb(response)
    })
}

export const getPrompt = (cb) => {
  axios.get(promptUrl)
    .then((response) => {
      cb(response.data)
    })
}