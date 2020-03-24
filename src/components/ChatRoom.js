import React, { useState, useEffect, useContext, useRef } from 'react';
import { emitSendMessage } from '../socket/emit/gameEmit';
import io from "socket.io-client";
import chatEvent from "../socket/event/chatEvent";
import socketContext from './socket/context';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

require('../css/chat.css')

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const messageType = {
  MINE: {
    align: "right",
    color: "darkgreen",
    paper: "lightgreen"
  },
  OTHER: {
    align: "left",
    color: "darkblue",
    paper: "lightblue"
  },
  SYSTEM: {
    align: "center",
    color: "purple",
    paper: "lavender"
  }
}

let chatInit = false;
const ChatRoom = (props) => {
  const { store } = useContext(socketContext);
  const [chatInfo, setChatInfo] = useState({
    message: '',
    chat: []
  })

  const chatInfoRef = useRef(chatInfo);
  const storeRef = useRef(store);
  const prevChatInfo = usePrevious(chatInfo)
  useEffect(() => {
    chatInfoRef.current = chatInfo;
    storeRef.current = store;
  });

  useEffect(() => {
    if (prevChatInfo && chatInfo.chat.length !== prevChatInfo.chat.length) {
      let chatHistory = document.getElementsByClassName("chat-window");
      if (chatHistory[0]) {
        chatHistory[0].scrollTop = chatHistory[0].scrollHeight;
      }
    }
  })

  useEffect(() => {
    if (!chatInit) {
      document.getElementById('outlined-size-small').addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
          _onSubmit();
        }
      })
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
            msg,
            type: "OTHER"
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
    if (chatInfoRef.current.message !== "") {
      emitSendMessage({
        room: storeRef.current.room,
        'message': chatInfoRef.current.message,
        name: storeRef.current.name
      });
      setChatInfo((prevState) => {
        return {
          ...prevState,
          chat: [
            ...prevState.chat,
            {
              name: "me",
              type: "MINE",
              msg: chatInfoRef.current.message
            }
          ],
          message: '',
        }
      })
    }
  }
  
  const renderChat = () => {
    const { chat } = chatInfo;
    const messages = chat.map(({name, msg, type}, idx) => {
      if (name === "SYSTEM") {
        type = "SYSTEM";
      }
      return (
        <div key={idx} style={{textAlign: `${messageType[type].align}`}}>
        <Paper 
          style={{
            backgroundColor: `${messageType[type].paper}`,
            marginTop: '3px',
            display: 'inline-block'
            }} 
          elevation={3}>
          <span style={{ color: `${messageType[type].color}` }}>{name}: </span>
          <span>{msg}</span>
        </Paper>
        </div>
      )
    });
    return messages;
  }

  return (
    <div className="chat-wrapper">
      <Paper elevation={10}>
      <div className="chat-window">
        {renderChat()}
      </div>
        <div className="chat-input-wrapper">
          <TextField
            inputProps={{
              style: {
                fontSize: '8px', 
                height: '18px',
              }
            }}
            className="chat-input"
            label="Type Here"
            id="outlined-size-small"
            margin="dense"
            variant="outlined"
            size="small"
            value={chatInfo.message}
            onChange={_onChange}
          />
          <Button
            className="chat-input-button"
            size="small"
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={_onSubmit}
          >
            Send
          </Button>
        </div>
      </Paper>
    </div>
  )
}


module.exports = ChatRoom;