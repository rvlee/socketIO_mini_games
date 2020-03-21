import React, { useState, useEffect, useRef } from 'react';
import { HuePicker } from 'react-color';
import throttle from '../utils/throttle';
import socketContext from './socket/context';
import { emitDrawing } from '../socket/emit/gameEmit';
import whiteBoardEvent from '../socket/event/whiteBoardEvent';

require('../css/whiteBoard.css');

let whiteBoardInit = false;
const HEIGHT = 300
const WIDTH = 300

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const whiteBoard = (props) => {
  const { store, setStore } = React.useContext(socketContext)
  const [whiteBoard, setWhiteBoard] = useState({
    board: React.createRef(),
    moving: false,
    drawing: false,
    currentX: null,
    currentY: null,
    penColor: '#000000',
  })

  const previousWhiteBoard = usePrevious(whiteBoard);
  const whiteBoardRef = useRef(whiteBoard);
  const storeRef = useRef(store)
  useEffect(() => {
    whiteBoardRef.current = whiteBoard;
    storeRef.current = store;
  });

  useEffect(() => {
    if (!whiteBoardInit) {
      whiteBoard.board.current.addEventListener("mousedown", onMouseDown, false)
      whiteBoard.board.current.addEventListener("mouseup", onMouseUp, false)
      whiteBoard.board.current.addEventListener(
        "mousemove",
        throttle(onMouseMove, 5),
        false
      );

      // Initialize listeners
      whiteBoardEvent({
        drawLine
      });

      whiteBoardInit = true;
    }
  })


  useEffect(() => {
    if (previousWhiteBoard && whiteBoard.moving) {
      drawLine(previousWhiteBoard.currentX, previousWhiteBoard.currentY, whiteBoard.currentX, whiteBoard.currentY)
    }
  })

  useEffect(() => {
    props.checkPictionaryBoard(clearBoard)
  })

  const onMouseDown = (e) => {
    setWhiteBoard((prevWhiteBoard) => {
      return {
        ...prevWhiteBoard,
        currentX: e.clientX,
        currentY: e.clientY,
        drawing: true
      }
    })
  }

  const onMouseUp = (e) => {
    setWhiteBoard((prevWhiteBoard) => {
      return {
        ...prevWhiteBoard,
        currentX: e.clientX,
        currentY: e.clientY,
        drawing: false,
        moving: false,
      }
    })
  }

  const onMouseMove = (e) => {
    if (!whiteBoardRef.current.drawing) {
      return
    }

    setWhiteBoard((prevWhiteBoard) => {
      return {
        ...prevWhiteBoard,
        currentX: e.clientX,
        currentY: e.clientY,
        moving: true,
      }
    })
  }

  const drawLine = (x0, y0, x1, y1, color, listened = false) => {
    if (listened || storeRef.current.playerTurn === storeRef.current.playerId) {
      let context = whiteBoard.board.current.getContext("2d");
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color || whiteBoard.penColor;
      context.lineWidth = 2;

      context.stroke();
      context.closePath();

      // Emit drawing to other users
      if (!listened) {
        emitDrawing({
          prevX: x0, 
          prevY: y0, 
          currX: x1, 
          currY: y1,
          room: store.room,
          color: whiteBoard.penColor, 
        })
      }
    }
  }

  const clearBoard = () => {
    whiteBoardRef.current.board.current.getContext("2d").clearRect(0, 0, WIDTH, HEIGHT);
  }
  
  const changeColor = (color) => {
    setWhiteBoard((prevWhiteBoard) => {
      return {
        ...prevWhiteBoard,
        penColor: color.hex,
      }
    })
  }

  return (
    <div>
      <canvas
        height={`${HEIGHT}px`}
        width={`${WIDTH}px`}
        className="whiteboard-canvas"
        ref={whiteBoard.board}
      />
      {
        props.playerTurn === store.playerId ? 
        <HuePicker
          width={`${WIDTH}px`}
          color={ whiteBoard.penColor }
          onChangeComplete={ changeColor }
        /> : null 
      }
    </div>
  )
}

export default whiteBoard