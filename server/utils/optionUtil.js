const getGameOptions = (game, room, gameOptions, options) => {
  let tempRoom = {
    ...room,
    gameOptions
  }
  switch (game) {
    case "CONNECTFOUR":
      tempRoom.gameOptions = {
        ...tempRoom.gameOptions,
        color: {
          0: options.color
        }
      }
      break;
    default:
      break;
  }
  return tempRoom
}

const setGameOptions = (room, options) => {
  let tempRoom = {
    ...room
  }
  switch (room.game) {
    case "CONNECTFOUR":
      const playerId = tempRoom.playerList.length - 1
      tempRoom.gameOptions.color = {
        ...tempRoom.gameOptions.color,
        [playerId]: options.color
      }
      break;
    default:
      break;
  }
  return tempRoom
}

const getRoomOptions = (roomInfo, options) => {
  let roomOptions = {
    room: roomInfo.room,
    game: roomInfo.game,
    gameOptions: roomInfo.gameOptions,
    order: roomInfo.playerList.length - 1,
  }
  switch (roomInfo.game) {
    case "CONNECTFOUR":
      roomOptions = {
        ...roomOptions,
        color: options.color 
      }
      break;
    default:
      break;
  }

  return roomOptions
}
module.exports = {
  getGameOptions,
  setGameOptions,
  getRoomOptions
}