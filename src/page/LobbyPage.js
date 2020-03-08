import React, { useState, useContext } from 'react';
import SocketContext from '../components/socket/context';
import Modal from '@material-ui/core/Modal';
import 
  createFormConfig, 
  {  
    NAME,
    GAMETYPE,
    ROOMNAME
  } from '../constant/createFormConfig';
import joinFormConfig from '../constant/joinFormConfig';
import {
  GAME
} from '../constant/page';
import { emitJoinRoom } from '../socket/emit';
import CreateForm from '../components/CreateForm';
import JoinForm from '../components/JoinForm';
import JoinTable from '../components/JoinTable';

require('../css/modal.css');

const CREATE = 'CREATE'
const JOIN = 'JOIN'

const LobbyPage = () => {
  const { store, setStore } = useContext(SocketContext);
  const [modal, setModal] = useState({
    open: false,
    type: null
  })
  const [createFormState, setCreateFormState] = useState({})

  const handleClose = () => {
    setModal((prevState) => {
      return {
        ...prevState,
        open: false
      }
    })
  }

  const handleModalClick = (type, room = null) => {
    setModal((prevState) => {
      return {
        ...prevState,
        type,
        open: true
      }
    })
    let initialState = {}
    if (room !== null) {
      initialState[ROOMNAME] = room
    }

    setCreateFormState(initialState)
  }

  const onInputChange = (key, value) => {
    setCreateFormState((prevState) => {
      return {
        ...prevState,
        [key]: value
      }
    })
  }

  const createGameRoom = () => {
    setStore((prevState) => {
      let tempState = {
        ...prevState,
        name: createFormState[NAME],
        room: createFormState[ROOMNAME],
        pageType: GAME,
        gameType: createFormState[GAMETYPE],
        gameOption: {},
      }
      createFormConfig.forEach((config) => {
        if (config.gameOption) {
          tempState = {
            ...tempState,
            gameOptions: {
              ...tempState.gameOptions,
              [config.key]: config.convert ? config.convert(createFormState[config.key]): createFormState[config.key]
            }
          }
        }
      })
      return tempState
    })
  }
  
  const joinRoom = () => {
    emitJoinRoom({
      name: createFormState[NAME],
      room: createFormState[ROOMNAME]
    })
  }

  let modalFormCmp = null;
  switch (modal.type) {
    case CREATE:
      modalFormCmp = (
        <CreateForm
          configs={createFormConfig}
          state={createFormState}
          onChange={onInputChange}
          createBtnClick={createGameRoom}
        />
      )
      break;
    case JOIN: 
      modalFormCmp = (
        <JoinForm
          configs={joinFormConfig}
          state={createFormState}
          onChange={onInputChange}
          joinBtnClick={joinRoom}
        />
      )
      break;
  }

  return (
    <div>
      <button onClick={() => { handleModalClick(CREATE) }}>Create Room</button>
      <Modal
        open={modal.open}
        onClose={handleClose}
      >
        <div className="modal-container">
          {modalFormCmp}
        </div>
      </Modal>
      <JoinTable 
        handleModalClick={(room) => { handleModalClick(JOIN, room) }}
      />
    </div>
  )
}

export default LobbyPage;