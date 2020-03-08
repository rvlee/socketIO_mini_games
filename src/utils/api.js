import axios from 'axios';

const url = '/rooms';

if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:3000/rooms';
}

export const getRooms = (cb) => {
  axios.get(url)
    .then((response) => {
      cb(response)
    })
}

