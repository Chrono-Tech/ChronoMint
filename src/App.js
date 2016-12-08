import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css'

import LOCContainer from 'components/LOC/LOCContainer'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  render () {
    return (
      <div className="App">
        <LOCContainer web3={this.props.web3} />
      </div>
    )
  }
}

export default App
