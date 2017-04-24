import React, { Component } from 'react'
import AccountSelector from './AccountSelector'

class LoginLocal extends Component {
  render () {
    return <AccountSelector onSelectAccount={() => this.props.onLogin()} />
  }
}

export default LoginLocal
