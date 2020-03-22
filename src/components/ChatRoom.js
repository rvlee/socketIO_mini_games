import React, { useState, useEffect, useContext} from 'react';
import { emitSendMessage } from '../socket/emit/gameEmit';
import io from "socket.io-client";
import chatEvent from "../socket/event/chatEvent";
import socketContext from './socket/context';

require('../css/chat.css')
let chatInit = false;
const ChatRoom = (props) => {
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
    if (props.whiteBoardCheckWinner) {
      props.whiteBoardCheckWinner(msg, name)
    }
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
    return chat.map(({name, msg}, idx) => {
      let color = "green"
      if (name === 'SYSTEM') {
        color = "purple"
      }
      return (
        <div key={idx}>
          <span style={{ color: color }}>{name}: </span>
          <span>{msg}</span>
        </div>
      )
    });
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-window">
        {renderChat()}
      </div>
      <input
        placeholder = "Type Message"
        value={chatInfo.message}
        onChange={_onChange}
      />
      <button onClick={_onSubmit}>Send</button>

    </div>
  )
}


module.exports = ChatRoom;