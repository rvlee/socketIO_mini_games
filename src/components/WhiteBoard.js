import React, { useState, useEffect, useRef } from 'react';
import { HuePicker } from 'react-color';
import throttle from '../utils/throttle';
import socketContext from './socket/context';
import { emitDrawing } from '../socket/emit/gameEmit';
import whiteBoardEvent from '../socket/event/whiteBoardEvent';

require('../css/whiteBoard.css');

let whiteBoardInit = false;
let bufferCanvas;

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
    height: window.innerHeight,
    width: window.innerWidth,
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
      whiteBoard.board.current.addEventListener("moustout", onMouseUp, false)
      whiteBoard.board.current.addEventListener(
        "mousemove",
        throttle(onMouseMove, 5),
        false
      );
      whiteBoard.board.current.addEventListener(
        "touchstart",
        onMouseDown,
        false
      )
      whiteBoard.board.current.addEventListener(
        "touchmove",
        throttle(onTouchMove, 5),
        false
      )
      whiteBoard.board.current.addEventListener(
        "touchend",
        onMouseUp,
        false
      )

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

  const onTouchMove = (e) => {
    if (!whiteBoardRef.current.drawing) {
      return
    }

    setWhiteBoard((prevWhiteBoard) => {
      return {
        ...prevWhiteBoard,
        currentX: e.touches[0].clientX,
        currentY: e.touches[0].clientY,
        moving:true,
      }
    })
  }

  const drawLine = (x0, y0, x1, y1, color, listened = false) => {
    if (listened || storeRef.current.playerTurn === storeRef.current.playerId) {
      const whitebordContainer = document.getElementById('whiteboard-container');
      let offsetX = whitebordContainer.offsetLeft;
      let offsetY = whitebordContainer.offsetTop;
      let context = whiteBoard.board.current.getContext("2d");
      context.beginPath();
      context.moveTo((x0 - offsetX), (y0 - offsetY));
      context.lineTo((x1 - offsetX), (y1 - offsetY));
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
    <div id="whiteboard-container">
      <canvas
        className="whiteboard-canvas"
        width="400px"
        height="400px"
        ref={whiteBoard.board}
      />
      {
        props.playerTurn === store.playerId ? 
        <div className="hue">
          <HuePicker
            height={`${20}px`}
            width={`400px`}
            color={ whiteBoard.penColor }
            onChangeComplete={ changeColor }
          /> 
        </div> : null 
      }
    </div>
  )
}

export default whiteBoard