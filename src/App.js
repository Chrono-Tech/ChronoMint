import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

import LOCContainer from 'components/LOC/LOCContainer'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
})
const store =
  (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(reducer)

class App extends Component {
  render () {
    return (
 <Provider store={store}>
      <div className="App">
        <LOCContainer web3={this.props.web3} />
      </div>
 </Provider>
    )
  }
}

export default App
