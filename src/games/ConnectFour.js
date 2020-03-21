import React, { useState } from 'react';

import Game from '../components/Game.js';

import calculateWinner from '../utils/checkWinner.js';

import createBoard from '../utils/createBoard.js';
import socketContext from '../components/socket/context';
import { emitMove } from '../socket/emit/gameEmit';
import {
  BOARDSIZE
} from '../constant/createFormConfig';

const connectFour = (props) => {
  const { store, setStore } = React.useContext(socketContext)

  const _handleClick = (x, y, board, otherPlayer) => {
    if (!otherPlayer) {
      emitMove({
        room: store.room, 
        x, 
        y
      });
    }
    let incXIndex =  1;
    let realX = 0;
    let realY = 0;
    let end = false;
    while (incXIndex === board.length !== undefined && !end) {
      if (board[incXIndex][y] !== null) {
        board[incXIndex - 1][y] = store.playerTurn
        realX = incXIndex - 1
        end = true
      } else if (incXIndex === board.length - 1) {
        board[incXIndex][y] = store.playerTurn
        realX = incXIndex
        end = true
      } 
      incXIndex++;
    }
    setStore((prevState) => ({
      ...prevState,
      x: realX,
      y: y
    }))
  }

  const _calculateCustomWinner = (x, y, state) => {
    return calculateWinner(x, y, state.board, 4, store.playerTurn)
  }

  const _renderSquare = (val, x, y, boardContext) => {
    let colorStyle = {
      backgroundColor: 'white'
    };
    if (val !== null) {
      colorStyle.backgroundColor = store.gameOptions.color[val+'']
    }


    return (
      <div key={`sqaure-${x}-${y}`} className="connect-square">
        <div 
          className="connect-piece"
          style={colorStyle}
        />
      </div>
    );
  }

  const _renderPostItems = (boardContext) => {
    let postButtonList = [];
    for (let i = 0; i < store.gameOptions[BOARDSIZE]; i++) {
      postButtonList.push(
        <button 
          key={`connect-btn-${i}`}
          className="connect-btn" 
          onClick={() => { boardContext.props.handleClick(null, i) }}
        >
          insert
        </button>
      )
    }
    return postButtonList
  }

  const _startGameCondition = () => {
    let condition = {}
    return {}
  }

  const _boardCheck = (state, x, y) => {
    return !state.board[0][y]
  }

  const _playerStatusComponent = () => {
    if (store.playerId === null) {
      return null;
    }

    return (
      <div>
        <div>
          Player {store.playerId} 
          <div className="circle" style={{backgroundColor: store.color}}/>
        </div>
        <div>Number of Players {store.playerList.length}</div>
        Current Turn Player {store.playerTurn}
        <div className="circle" style={{backgroundColor: store.gameOptions.color[store.playerTurn]}}/>
      </div>
    )
  }

  return (
    <Game 
      startGameCondition={_startGameCondition}
      handleCustomClick={_handleClick}
      calculateWinner={_calculateCustomWinner}
      boardCheck={_boardCheck}
      renderSquare={_renderSquare}
      renderPostItems={_renderPostItems}
      playerStatusComponent={_playerStatusComponent}
      board={createBoard(store.gameOptions[BOARDSIZE], store.gameOptions[BOARDSIZE])}
      {...props}
    />
  )
}

module.exports = connectFour;
