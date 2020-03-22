import React, { useState, useEffect } from 'react';
import SocketContext from './context'
import { initSockets } from '../../socket/socket';
import { LOBBY, GAME } from '../../constant/page';
import { TICTACTOE } from '../../constant/game';

const SocketProvider = (props) => {
  const [globalValue, setGlobalValue] = useState({
    name: null,
    pageType: GAME,
    room: null,
    gameType: 'PICTIONARY',
    gameOptions: {},
    playerList: [],
    playerId: null,
    playerTurn: null,
    x: 0,
    y: 0,
    gameEventInit: false
  })

  useEffect(() => { initSockets(setGlobalValue) }, [initSockets])
  
  const store = {
    store: globalValue,
    setStore: setGlobalValue,
  }

  return (
    <SocketContext.Provider value={store}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketProvider