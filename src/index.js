import React, {Fragment, useContext} from 'react';
import ReactDOM from 'react-dom';
import TicTacToe from './games/TicTacToe.js';
import ConnectFour from './games/ConnectFour.js';
import SocketContext from './components/socket/context';
import ChatRoom from './components/ChatRoom.js';
import { gameList } from './constant/game.js';
import Lobby from './page/LobbyPage.js';
import Game from './page/GamePage.js';
import { LOBBY, GAME } from './constant/page.js';
//css
require('./css/index.css');

const Index = () => {
	const { store } = useContext(SocketContext);
	
	switch (store.pageType) {
		case LOBBY:
			return <Lobby />
		case GAME:
			return <Game />
		default:
			return null;
	}
}

module.exports = Index;
