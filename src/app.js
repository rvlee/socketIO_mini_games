/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import Index from './index';

type Props = {||};

class App extends React.Component<Props> {
	render() {
		return (
      <Index />
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
