import React from 'react';

class Board extends React.Component {
  state = {
    board: null
  }

  render() {
    const {
      board
    } = this.props;

    return (
      <div>
        {
          board.map((column, indexX) => {
            return (
              <div key={`col-${indexX}`}>
                {
                  column.map((row, indexY) => {
                    return (
                      this.props.renderSquare(row, indexX, indexY, this)
                    )
                  })
                }
              </div>
            )
          })
        }
        {this.props.renderPostItems(this)}
      </div>
    )
  }
}

Board.defaultProps = {
  renderPostItems: () => {return null}
};

module.exports = Board;