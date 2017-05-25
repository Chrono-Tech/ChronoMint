import React, { Component } from 'react'
import AccountSelector from './AccountSelector'
import web3Provider from '../../../network/Web3Provider'
import Web3 from 'web3'

class LoginLocal extends Component {
  componentWillMount () {
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(new web3.providers.HttpProvider('//localhost:8545'))
  }

  render () {
    return <AccountSelector onSelectAccount={() => this.props.onLogin()} />
  }
}

export default LoginLocal
