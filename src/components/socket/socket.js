import React, { useState, useEffect } from 'react';
import SocketContext from './context'
import { initSockets } from '../../socket/socket';

const SocketProvider = (props) => {
  const [globalValue, setGlobalValue] = useState({
    room: null,
    playerId: null,
    x: 0,
    y: 0,
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