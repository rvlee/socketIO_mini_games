export default (w, l) => {
  let board = [];
  for (let i = 0; i < w; i++) {
    board.push(Array(l).fill(null))
  }
  return board;
}