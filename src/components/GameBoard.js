import React, { useState, useEffect, useRef, Fragment} from 'react';
import Board from './Board';
import WhiteBoard from './WhiteBoard';
import Timer from './Timer';
import { emitPictionaryStart } from '../socket/emit/gameEmit';
import socketContext from './socket/context';
import ChatRoom from './ChatRoom';

require('../css/gameBoard.css');

import {
  CONNECTFOUR,
  TICTACTOE,
  PICTIONARY
} from '../constant/game';

export default ({
  gameState,
  gameProps,
  handleClick
}) => {
  const { store, setStore } = React.useContext(socketContext)
  let cmp = <div />
  switch (store.gameType) {
    case CONNECTFOUR:
    case TICTACTOE:
      cmp = (
        <Board 
          handleClick={handleClick}
          board={gameState.board}
          renderSquare={gameProps.renderSquare}
          renderPostItems={gameProps.renderPostItems}
        />
      )
      break;
    case PICTIONARY:
      cmp = (
        <div className="game-column" style={{ width: '75%'}}>
          <div className="gameboard-column whiteboard-user">
            users
          </div>
          <div className="gameboard-column whiteboard-wrapper">
            <div className="gameboard-options">
            {
              gameProps.pictionaryGameStart ? <div>
                <Timer /> 
                {
                  store.playerId === store.playerTurn ? 
                  <div>Prompt: {gameProps.whiteboardPrompt}</div> : null
                }
              </div> : store.playerId === store.playerTurn ?
                  <button onClick={() => {emitPictionaryStart({ room: store.room })}}> Start Game </button> : null
            }
            </div>
            <WhiteBoard 
              playerTurn={store.playerTurn}
              checkPictionaryBoard={gameProps.checkPictionaryBoard}
            />
          </div>
        </div>
      )
    default:
      break;
  }

  return (
    <div>
      {cmp}
      <div className="game-column" style={{ width: '25%'}}>
        <ChatRoom 
          {...gameProps} 
          whiteBoardCheckWinner={gameProps.whiteBoardCheckWinner}
        />
      </div>
    </div>
  )
}