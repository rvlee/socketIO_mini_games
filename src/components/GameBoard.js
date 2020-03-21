import React, { useState, useEffect, useRef, Fragment} from 'react';
import Board from './Board';
import WhiteBoard from './WhiteBoard';
import Timer from './Timer';
import { emitPictionaryStart } from '../socket/emit/gameEmit';
import socketContext from './socket/context';

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
        <div>
          <WhiteBoard 
            playerTurn={store.playerTurn}
            checkPictionaryBoard={gameProps.checkPictionaryBoard}
          />
          {
            gameProps.pictionaryGameStart ? 
            <div>
              <Timer /> 
              {
                store.playerId === store.playerTurn ? 
                <h4>Prompt: {gameProps.whiteboardPrompt}</h4> : null
              }
            </div> :
              store.playerId === store.playerTurn ?
              <button onClick={() => {emitPictionaryStart({ room: store.room })}}> Start Game </button> : null
          }

        </div>
      )
    default:
      break;
  }

  return cmp
}