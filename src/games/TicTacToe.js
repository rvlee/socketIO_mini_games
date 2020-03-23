import React, {Fragment} from 'react';

import Game from '../components/Game.js';
import Square from '../components/Square.js';

import createBoard from '../utils/createBoard.js';
import calculateWinner from '../utils/checkWinner.js';
import ticTacToeConfig from '../constant/ticTacToeConfig.js';

import socketContext from '../components/socket/context';

import { emitMove } from '../socket/emit/gameEmit';

const ticTacToe = (props) => {
  const { store, setStore } = React.useContext(socketContext)
  const _handleCustomClick = (x, y, board, otherPlayer) => {
    if (!otherPlayer) {
      emitMove({
        room: store.room, 
        x, 
        y
      });
    }
    setStore((prevStore) => ({
      ...prevStore,
      x,
      y
    }))
    board[x][y] = ticTacToeConfig[store.playerTurn].label
  }

  const _calculateCustomWinner = (x, y, state) => {
    return calculateWinner(x, y, state.board, 3, ticTacToeConfig[store.playerTurn].label)
  }

  const _renderSquare = (val, x, y, boardContext) => {
    return (
      <Square
        key={`sqaure-${x}-${y}`}
        value={val}
        onClick={()=> {
          boardContext.props.handleClick(x, y)
        }} 
      />
    );
  }

  const _playerStatusComponent = () => {
    if (store.playerId === null) {
      return null
    }
    return (
      <div>
        You are Player: {ticTacToeConfig[store.playerId].label}
      </div>
    )
  }

  const _boardCheck = (state, x, y) => {
    return state.board[x][y] === null
  }

  return (
    <Game
      handleCustomClick={_handleCustomClick}
      calculateWinner={_calculateCustomWinner}
      boardCheck={_boardCheck}
      renderSquare={_renderSquare}
      playerStatusComponent={_playerStatusComponent}
      board={createBoard(3, 3)}
      {...props}
    />
  )
  
}
module.exports = ticTacToe;
