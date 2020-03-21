import React, { useState, useRef, useEffect } from 'react';
import Game from '../components/Game.js';
import { getPrompt } from '../utils/api';
import socketContext from '../components/socket/context';
import { emitWin, emitChangePlayer, emitPictionaryStart } from '../socket/emit/gameEmit';
import pictionaryEvent from '../socket/event/pictionaryEvent';


const Pictionary = (props) => {
  const { store, setStore } = React.useContext(socketContext)
  const [pictionaryBoard, setPictionaryBoard] = useState(false)
  const [pictionary, setPictionary] = useState({
    prompt: null,
    pictionaryGameStart: false,
  })

  const storeRef = useRef(store);
  const pictionaryRef = useRef(pictionary);

  useEffect(() => {
    storeRef.current = store
    pictionaryRef.current = pictionary
  });

  useEffect(() => {
    if (!store.gameEventInit) {
      pictionaryEvent({
        onChangePlayerTurn: (playerTurn) => { onChangePlayerTurn(playerTurn) },
        togglePictionaryGame: togglePictionaryGame
      });
    }
  })


  const getPictionaryPrompt = (gameState) => {
    if (store.playerId === null) {
      pictionaryApiCall()
    }
  }
  
  const pictionaryApiCall = () => {
    getPrompt(({prompt}) => {
      console.log(prompt)
      setPictionary((prevPictionary) => {
        return {
          ...prevPictionary,
          prompt
        }
      })
    })
  }

  // Only the drawer will execute this function to check winner
  const checkWinner = (word, name) => {
    if (storeRef.current.playerTurn === storeRef.current.playerId) {
      if (pictionaryRef.current.prompt === word.toLowerCase()) {
        //alert("winner")
        console.log('checkWinner')
        emitPictionaryStart({
          room: storeRef.current.room
        })
        emitChangePlayer({
          room: storeRef.current.room
        })

        setPictionaryBoard(true)
        emitWin({
          room: storeRef.current.room,
          name
        })
      }
    }
  }  

  // Users who are not the drawing will execute this event
  const winEvent = (changePlayer) => {
    console.log('winner')
    setPictionaryBoard(true)
  }

  // Getting new prompt each time changes player
  const onChangePlayerTurn = (newPlayerTurn) => {
    if (newPlayerTurn === storeRef.current.playerId) {
      pictionaryApiCall()
    }
  }

  const checkPictionaryBoard = (clearBoard) => {
    if (pictionaryBoard) {
      clearBoard()
      setPictionaryBoard(false)
    }
  }

  const togglePictionaryGame = () => {
    setPictionary((prevPictionary)=> {
      return {
        ...prevPictionary,
        pictionaryGameStart: !prevPictionary.pictionaryGameStart,
      }
    })
  }

  return (
    <div> 
      <Game
        whiteBoardCheckWinner={checkWinner}
        whiteboardPrompt={pictionary.prompt}
        checkPictionaryBoard={checkPictionaryBoard}
        customGameEventInit={getPictionaryPrompt}
        customWinEvent={winEvent}
        pictionaryGameStart={pictionary.pictionaryGameStart}
        {...props}
      />
    </div>
  )
}

module.exports = Pictionary;