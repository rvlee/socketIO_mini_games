import React from 'react';
import ReactDOM from 'react-dom';
import Index from './index';
import SocketProvider from './components/socket/socket';

type Props = {||};

class App extends React.Component<Props> {
	render() {
		return (
			<SocketProvider>
				<Index />
			</SocketProvider>
		)
	}
}

const dom = document.getElementById('App')
if (dom === null) {
	//Error
	console.error("dom does not exist")
} else {
	ReactDOM.render(<App />, dom);
}
