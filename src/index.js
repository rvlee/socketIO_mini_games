import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import TicTacToe from './games/TicTacToe.js';
import ConnectFour from './games/ConnectFour.js';
import SocketProvider from './components/socket/socket';
import { gameList } from './constant/game.js';
//css
require('./css/index.css');

class Index extends React.Component {
	state = {
		game: null,
	}

	_selectGame = (game) => {
		this.setState({
			game: game({
				resetGame: this._resetGame
			})
		})
	}

	_resetGame = () => {
		this.setState({
			game: null
		})
	}

	render() {
		const {
			game
		} = this.state

		return(
			<div className="game">
				<div className = "game-board">
					{
						gameList.map((game) => {
							return (
								<button key={game.label} onClick={() => {this._selectGame(game.gameComponent)}}>{game.label}</button>
							)
						})
					}
					<SocketProvider>
						{game}
					</SocketProvider>
				</div>
			</div>
		)
	}
}

module.exports = Index;
