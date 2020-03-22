import React, { useState, useEffect, useRef, Fragment} from 'react';

import GameBoard from '../components/GameBoard.js';
import ChatRoom from './ChatRoom';
import { emitCreateRoom, emitRestartRoom, emitChangePlayer } from '../socket/emit/gameEmit';
import socketContext from './socket/context';
import gameEvent from '../socket/event/gameEvent';
import disconnect from '../utils/disconnect';

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
    board: null,
    gameStart: false,
    gameEnd: false,
    moves: 0,
    otherPlayer: false,
  });

  const previousGameInfo = usePrevious(gameInfo)
  const propsRef = useRef(props);
  const gameInfoRef = useRef(gameInfo);
  const storeRef = useRef(store);
  useEffect(() => {
    gameInfoRef.current = gameInfo;
    propsRef.current = props;
    storeRef.current = store
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
    if (!store.gameEventInit) {
      if (props.customGameEventInit) {
        props.customGameEventInit(gameInfo)
      }
      console.log("Test")
      _startGame();
      gameEvent({
        winEvent: () => { if (props.customWinEvent) { props.customWinEvent(_changePlayer)}},
        startGame: () => { _startGame(true)},
        handleClick: (x, y) => { _handleClick(x, y, true)},
        restartGame: () => { setStore((prevState) => {
          return {
            name: null,
            pageType: 'LOBBY',
            room: null,
            gameType: null,
            gameOptions: {},
            playerList: [],
            playerId: null,
            x: 0,
            y: 0,
          }
        })}
      })
      setStore((prevState) => {
        return {
          ...prevState,
          gameEventInit: true
        }
      })
    }
  })

  const _handleClick = (x, y, otherPlayer = false) => {
    if (otherPlayer || (!gameInfoRef.current.gameEnd && storeRef.current.playerTurn === storeRef.current.playerId)) {
      if (otherPlayer || propsRef.current.boardCheck(gameInfoRef.current, x, y)) {
        const newBoard = [...gameInfoRef.current.board];
        propsRef.current.handleCustomClick(x, y, newBoard, otherPlayer);
        setGameInfo((prevState) => ({
          ...gameInfoRef.current,
          board: newBoard,
          moves: gameInfoRef.current.moves + 1,
          otherPlayer: otherPlayer
        }))
      } else {
        alert('Please click on empty')
      }
    }
  }

  const _changePlayer = () => {
    if (!gameInfoRef.current.otherPlayer) {
      emitChangePlayer({ room: storeRef.current.room })
    }
  }

  const _endGame = () => {
    setGameInfo((prevGameInfo) => {
      return {
        ...prevGameInfo,
        gameEnd: true
      }
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
    setGameInfo((prevGameInfo) => {
      return {
        ...prevGameInfo,
        board: propsRef.current.board,
        gameStart: true,
        gameEnd: false,
        moves: 0,
      }
    })
  }

  return(
    <div className="game">
      {props.headerComponent(gameInfo.gameStart)}
      {
        gameInfo.gameStart ? (
          <div>
            <div className="status">{props.playerStatusComponent()}</div>
            <div className = "game-board">
              <GameBoard
                gameState={gameInfo}
                gameProps={props}
                handleClick={_handleClick}
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
  startGameCondition: () => {return {}},
  playerStatusComponent: () => { return null}
};

module.exports = Game;
