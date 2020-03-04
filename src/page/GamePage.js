import React, { useContext } from 'react';
import SocketContext from '../components/socket/context';
import { TICTACTOE, CONNECTFOUR } from '../constant/game';
import TicTactoe from '../games/TicTacToe.js';
import ConnectFour from '../games/ConnectFour.js';
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
    default:
      break;
  }

  return (
    <div>
      {gameCmp}
      <ChatRoom />
    </div>
  )
}

export default GamePage;