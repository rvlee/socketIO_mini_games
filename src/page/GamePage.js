import React, { useContext } from 'react';
import SocketContext from '../components/socket/context';
import { TICTACTOE, CONNECTFOUR, PICTIONARY } from '../constant/game';
import TicTactoe from '../games/TicTacToe.js';
import ConnectFour from '../games/ConnectFour.js';
import Pictionary from '../games/Pictionary.js';
import ChatRoom from '../components/ChatRoom.js';

const GamePage = () => {
  const { store } = useContext(SocketContext);
  let gameCmp = <div />

  switch (store.gameType) {
    case TICTACTOE:
      gameCmp = <TicTactoe />;
      break;
    case CONNECTFOUR:
      gameCmp = <ConnectFour />;
      break;
    case PICTIONARY:
      gameCmp = <Pictionary />;
    default:
      break;
  }

  return (
    <div>
      {gameCmp}
    </div>
  )
}

export default GamePage;