import {
  TEXT,
  DROPDOWN,
  NUMBER,
  COLOR
} from './formTypes'
export const NAME = 'NAME';

import {
  TICTACTOE,
  CONNECTFOUR,
  TICTACTOEVALUE,
  CONNECTFOURVALUE
} from './game';

export const GAMETYPE = 'GAMETYPE';

export default [
  {
    label: 'Name',
    key: NAME,
    type: TEXT,
    defaultVal: '',
    required: true,
  },
  {
    label: 'Color',
    key: COLOR,
    type: COLOR,
    condition: (state) => { return state[GAMETYPE] === CONNECTFOUR},
    defaultVal: '',
    required: true,
  }
]