import React, { useState, useEffect, useRef } from 'react';
import { HuePicker } from 'react-color';
import throttle from '../utils/throttle';
import socketContext from './socket/context';
import { emitDrawing } from '../socket/emit/gameEmit';
import whiteBoardEvent from '../socket/event/whiteBoardEvent';

require('../css/whiteBoard.css');

let whiteBoardInit = false;
let coordinates = [];

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
    resize: false,
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

      window.addEventListener('resize', resize);
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

  useEffect(() => {
    if (whiteBoard.resize) {
      let canvasSize = getCanvasSize();
      coordinates.forEach((coordinate) => {
        drawLine(
          coordinate.x0 * canvasSize,
          coordinate.y0 * canvasSize,
          coordinate.x1 * canvasSize,
          coordinate.y1 * canvasSize,
          coordinate.color
        )
      })

      setWhiteBoard((previousWhiteBoard) => {
        return {
          ...previousWhiteBoard,
          resize: false
        }
      })
    }
  })

  const resize = () => {
    setWhiteBoard((previousWhiteBoard) => {
      return {
        ...previousWhiteBoard,
        width: window.innerWidth,
        height: window.innerHeight,
        resize: true
      }
    })
  }

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

  const getCanvasSize = () => {
    let width = whiteBoard.width * 0.8 * 0.75;
    let height = whiteBoard.height;
    return (width <= height ? width : height) - 10
  }

  const drawLine = (x0, y0, x1, y1, color, listened = false) => {
    if (listened || storeRef.current.playerTurn === storeRef.current.playerId) {
      const canvasSize = getCanvasSize()
      let x0n = x0;
      let y0n = y0;
      let x1n = x1;
      let y1n = y1;
      if (listened) {
        x0n = x0n * canvasSize;
        y0n = y0n * canvasSize;
        x1n = x1n * canvasSize;
        y1n = y1n * canvasSize;
      }
      if (!whiteBoard.resize) {
        
        coordinates.push({
          x0: x0 / canvasSize,
          y0: y0 / canvasSize,
          x1: x1 / canvasSize,
          y1: y1 / canvasSize,
          color: color || whiteBoard.penColor
        })
      }
      console.log(color)
      let offsetX = whiteBoard.board.current.offsetLeft;
      let offsetY = whiteBoard.board.current.offsetTop;
      let context = whiteBoard.board.current.getContext("2d");
      context.beginPath();
      context.moveTo((x0n - offsetX), (y0n - offsetY));
      context.lineTo((x1n - offsetX), (y1n - offsetY));
      context.strokeStyle = color || whiteBoard.penColor;
      context.lineWidth = 2;

      context.stroke();
      context.closePath();

      // Emit drawing to other users
      if (!listened && !whiteBoard.resize) {
        emitDrawing({
          prevX: x0 / canvasSize, 
          prevY: y0 / canvasSize, 
          currX: x1 / canvasSize, 
          currY: y1 / canvasSize,
          room: store.room,
          color: whiteBoard.penColor, 
        })
      }
    }
  }

  const clearBoard = () => {
    whiteBoardRef.current.board.current.getContext("2d").clearRect(0, 0, getCanvasSize(), getCanvasSize());
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
        width={`${getCanvasSize()}px`}
        height={`${getCanvasSize()}px`}
        ref={whiteBoard.board}
      />
      {
        props.playerTurn === store.playerId ? 
        <div className="hue" style={{ bottom: `${window.innerHeight - getCanvasSize() - 5}px`}}>
          <HuePicker
            height={`${20}px`}
            width={`${getCanvasSize()-10}px`}
            color={ whiteBoard.penColor }
            onChangeComplete={ changeColor }
          /> 
        </div> : null 
      }
    </div>
  )
}

export default whiteBoard