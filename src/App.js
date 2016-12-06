import React, { Component } from 'react'
import './App.css'

import AccountListContainer from 'components/AccountList/AccountListContainer'

class App extends Component {
  render () {
    return (
      <div className="App">
        <AccountListContainer />
      </div>
    )
  }
}

export default App
