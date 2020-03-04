import React, { useState, useEffect, useContext} from 'react';
import { emitSendMessage } from '../socket/emit';
import io from "socket.io-client";
import chatEvent from "../socket/chatEvent";
import socketContext from './socket/context';

let chatInit = false;
const ChatRoom = () => {
  const { store } = useContext(socketContext);
  const [chatInfo, setChatInfo] = useState({
    message: '',
    chat: []
  })


  useEffect(() => {
    if (!chatInit) {
      chatEvent({
        onMessage: onMessage
      });
      chatInit = true;
    }
  })

  const onMessage = (room, msg, name) => {
    setChatInfo((prevState) => {
      return {
        ...prevState,
        chat: [
          ...prevState.chat, 
          {
            name, 
            msg
          }
        ]
      }
    });
  }

  const _onChange = (e) => {
    e.persist();
    setChatInfo((prevState) => {
      return {
        ...prevState,
        message: e.target.value
      }
    })
  }

  const _onSubmit = () => {
    emitSendMessage({
      room: store.room,
      'message': chatInfo.message,
      name: store.name
      });
    setChatInfo((prevState) => {
      return {
        ...prevState,
        chat: [
          ...prevState.chat,
          {
            name: "me",
            msg: chatInfo.message
          }
        ],
        message: '',
      }
    })
  }
  
  const renderChat = () => {
    const { chat } = chatInfo;
    return chat.map(({name, msg}, idx) => (
      <div key={idx}>
        <span style={{ color: "green" }}>{name}: </span>
        <span>{msg}</span>
      </div>
    ));
  }

  return (
    <div>
      <input
        placeholder = "Type Message"
        value={chatInfo.message}
        onChange={_onChange}
      />
      <button onClick={_onSubmit}>Send</button>
      <div>
        {renderChat()}
      </div>
    </div>
  )
}


module.exports = ChatRoom;