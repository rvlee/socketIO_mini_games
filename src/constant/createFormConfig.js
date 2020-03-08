import {
  TEXT,
  DROPDOWN,
  NUMBER,
} from './formTypes'
import {
  TICTACTOE,
  CONNECTFOUR,
  TICTACTOEVALUE,
  CONNECTFOURVALUE
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
    defaultVal: ''
  },
  {
    label: 'Room Name',
    key: ROOMNAME,
    type: TEXT,
    defaultVal: ''
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
        }
      ]
    }
  },
  {
    label: 'Color',
    key: COLOR,
    type: TEXT,
    defaultVal: '',
    condition: (state) => { return state[GAMETYPE] === CONNECTFOUR},
    gameOption: true
  },
  {
    label: 'Board Size',
    key: BOARDSIZE,
    type: NUMBER,
    defaultVal: 0,
    condition: (state) => { return state[GAMETYPE] === CONNECTFOUR},
    gameOption: true,
    convert: (value) => Number(value) 
  }
]