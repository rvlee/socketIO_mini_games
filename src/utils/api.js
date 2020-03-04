import axios from 'axios';

const url = 'http://localhost:3000/rooms';

export const getRooms = (cb) => {
  axios.get(url)
    .then((response) => {
      cb(response)
    })
}

