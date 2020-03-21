import {
  TEXT,
  DROPDOWN,
  NUMBER,
} from './formTypes'
import {
  TICTACTOE,
  CONNECTFOUR,
  TICTACTOEVALUE,
  CONNECTFOURVALUE,
  PICTIONARY,
  PICTIONARYVALUE,
} from './game';

export const NAME = 'NAME';
export const ROOMNAME = 'ROOMNAME';
export const GAMETYPE = 'GAMETYPE';
export const COLOR = 'COLOR';
export const BOARDSIZE = 'BOARDSIZE';

export default [
  {
    label: 'Name',
    key: NAME,
    type: TEXT,
    defaultVal: '',
    required: true
  },
  {
    label: 'Room Name',
    key: ROOMNAME,
    type: TEXT,
    defaultVal: '',
    required: true
  },
  {
    label: 'Game',
    key: GAMETYPE,
    type: DROPDOWN,
    defaultVal: '',
    options: {
      dropdown: [
        {
          value: TICTACTOE,
          label: TICTACTOEVALUE,
        },
        {
          value: CONNECTFOUR,
          label: CONNECTFOURVALUE,
        },
        {
          value: PICTIONARY,
          label: PICTIONARYVALUE,
        }
      ]
    },
    required: true
  },
  {
    label: 'Board Size',
    key: BOARDSIZE,
    type: NUMBER,
    defaultVal: 0,
    condition: (state) => { return state[GAMETYPE] === CONNECTFOUR},
    gameOption: true,
    convert: (value) => Number(value),
    required: true
  },
  {
    label: 'Pick your color',
    key: COLOR,
    type: COLOR,
    defaultVal: '',
    condition: (state) => { return state[GAMETYPE] === CONNECTFOUR},
    required: true
  },  
]