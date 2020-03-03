import React from 'react';
import TicTacToe from '../games/TicTacToe.js'
import ConnectFour from '../games/ConnectFour.js'

export const TICTACTOE = 'TICTACTOE';
export const CONNECTFOUR = 'CONNECTFOUR';

export const gameList = [
  {
    key: TICTACTOE,
    label: 'Tic Tac Toe',
    gameComponent: (props) => {
      return (
        <TicTacToe 
          {...props}
        />
      )
    }
  },
  {
    key: CONNECTFOUR,
    label: 'Connect Four',
    gameComponent: (props) => {
      return (
        <ConnectFour 
          {...props}
        />
      )
    }
  }
]				