import React, { useState, useEffect, useRef, Fragment} from 'react';

import Board from '../components/Board.js';

import createBoard from '../utils/createBoard.js';
import { emitCreateRoom, emitRestartRoom } from '../socket/emit';
import socketContext from './socket/context';
import gameEvent from '../socket/gameEvent';
import disconnect from '../utils/disconnect';

let gameEventInit = false;

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const Game = (props) => {
  const { store, setStore } = React.useContext(socketContext)
  disconnect(store.room);
  const [gameInfo, setGameInfo] = useState({
    playerTurn: 0,
    board: null,
    gameStart: false,
    gameEnd: false,
    moves: 0
  });

  const previousGameInfo = usePrevious(gameInfo)
  const propsRef = useRef(props);
  const gameInfoRef = useRef(gameInfo);
  useEffect(() => {
    gameInfoRef.current = gameInfo;
    propsRef.current = props;
  });

  useEffect(() => {
    if (previousGameInfo && gameInfo.moves !== previousGameInfo.moves && gameInfo.moves !== 0) {
      if (props.calculateWinner(store.x, store.y, gameInfo)) {
        _endGame();
      } else if (gameInfo.moves === gameInfo.board.length * gameInfo.board[0].length) { 
        _endGame();
      } else { 
        _changePlayer()
      }
    }
  })

  // Create game event handler
  useEffect(() => {
    if (!gameEventInit) {
      _startGame();
      gameEvent({
        startGame: () => { _startGame(true)},
        handleClick: (x, y) => { _handleClick(x, y, true)},
        restartGame: () => { setStore((prevState) => {return {...prevState, pageType: 'LOBBY'}})}
      })
      gameEventInit = true;
    }
  })

  const _handleClick = (x, y, otherPlayer = false) => {
    if (otherPlayer || (!gameInfoRef.current.gameEnd && gameInfoRef.current.playerTurn === propsRef.current.playerId)) {
      if (otherPlayer || propsRef.current.boardCheck(gameInfoRef.current, x, y)) {
        const newBoard = [...gameInfoRef.current.board];
        propsRef.current.handleCustomClick(x, y, newBoard, gameInfoRef.current.playerTurn, otherPlayer);
        setGameInfo((prevState) => ({
          ...gameInfoRef.current,
          board: newBoard,
          moves: gameInfoRef.current.moves + 1
        }))
      } else {
        alert('Please click on empty')
      }
    }
  }

  const _changePlayer = () => {
    let tempPlayerTurn = gameInfoRef.current.playerTurn + 1
    if (tempPlayerTurn > store.playerList.length - 1) {
      tempPlayerTurn = 0
    }
    setGameInfo({
      ...gameInfo,
      playerTurn: tempPlayerTurn
    })
  }

  const _endGame = () => {
    setGameInfo({
      ...gameInfo,
      gameEnd: true
    })
  }

  const _startGame = (restart) => {
    if (!restart && store.playerId === null) {
      emitCreateRoom({ 
        name: store.name,
        room: store.room,
        game: store.gameType,
        color: store.color,
        gameOptions: store.gameOptions
      });
    }
    setGameInfo({
      ...gameInfo,
      board: createBoard(propsRef.current.width, propsRef.current.length),
      gameStart: true,
      gameEnd: false,
      moves: 0,
    })
  }

  return(
    <div className="game">
      {props.headerComponent(gameInfo.gameStart)}
      {
        gameInfo.gameStart ? (
          <div>
            <div className="status">{props.playerStatusComponent(gameInfo.playerTurn)}</div>
            <div className = "game-board">
              <Board 
                board={gameInfo.board}
                handleClick={_handleClick}
                renderSquare={props.renderSquare}
                renderPostItems={props.renderPostItems}
              />
            </div> 
          </div>
        ): null
      }
      {
        gameInfo.gameEnd ? (
          <button 
            onClick={() => {
              emitRestartRoom({room: store.room})
              _startGame(true)
            }}
          >Restart</button>
        ) : null
      }
    </div>
  )
}

Game.defaultProps = {
  headerComponent: (gameStart) => {return null},
  startGameCondition: () => {return {}}
};

module.exports = Game;
