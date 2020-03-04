import React from 'react';
import {
  TEXT,
  DROPDOWN
} from '../constant/formTypes.js';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const modalFormFactory = (
  createFormState, 
  { 
    label, 
    type, 
    key, 
    options, 
    condition = () => true
  }, 
  onChange
) => {
  const value = createFormState[key];
  let cp = <div />
  if (condition(createFormState)) {
    switch (type) {
      case TEXT:
        cp = (
          <TextField
            label={label}
            value={value} 
            onChange={(e) => {onChange(key, e.target.value) }}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        )
        break;
      case DROPDOWN:
        cp = (
          <TextField
            select
            label={label}
            value={value}
            onChange={(e) => { onChange(key, e.target.value) }}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          >
            {options.dropdown.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )
        break;
      default:
        break;
    }
  }

  return (
    <div>
      {cp}
    </div>
  )
}

export default modalFormFactory;