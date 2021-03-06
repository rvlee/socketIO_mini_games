import React from 'react';

function Square(props) {
    return (
      <button className="tictactoe-square" onClick={props.onClick}> 
        {props.value} 
      </button>
    )
}

module.exports = Square;