const checker = (counter, player, winCondition, incrementFowardFunc, incrementBackwardFunc) => {
  let startIndex = 1;
  let foward = null;
  let backward = null;

  while (
    foward !== undefined || 
    backward !== undefined
  ) {
    foward = incrementFowardFunc(startIndex);
    backward = incrementBackwardFunc(startIndex);
    if (foward === player) {
      counter++
    }
    if (backward === player) {
      counter++
    }
    if (counter === winCondition - 1) {
      return true
    }
    startIndex++;
  }
  return false;
}

export default (x, y, board, winCondition, player) => {
  let counter = 0;
  let row = checker(counter, player, winCondition, 
    (index) => {
      return board[x][y + index]
    },
    (index) => {
      return board[x][y - index]
    },
  )

  let column = checker(counter, player, winCondition, 
    (index) => {
      return board[x + index] && board[x + index][y]
    },
    (index) => {
      return board[x - index] && board[x - index][y]
    },
  )

  let rDiagnal = checker(counter, player, winCondition, 
    (index) => {
      return board[x + index] && board[x + index][y + index]
    },
    (index) => {
      return board[x - index] && board[x - index][y - index]
    }
  )

  let lDiagnal = checker(counter, player, winCondition, 
    (index) => {
      return board[x - index] && board[x - index][y + index]
    },
    (index) => {
      return board[x + index] && board[x + index][y - index]
    }
  )

  return (row || column || rDiagnal || lDiagnal);
}
