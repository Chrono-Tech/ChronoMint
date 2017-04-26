import React, { Component } from 'react'
import {connect} from 'react-redux'
import LoginMnemonic from './LoginMnemonic'
import LoginPrivateKey from './LoginPrivateKey'
import Web3 from 'web3'
import web3Provider from '../../../network/Web3Provider'
import mnemonicProvider from '../../../network/MnemonicProvider'
import { getNetworkById, providerMap } from '../../../network/networkSettings'
import NetworkSelector from './NetworkSelector'
import AccountSelector from './AccountSelector'

const SELECT_LOGIN_OPTION = 1
const SELECT_ACCOUNT = 2

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId
})

@connect(mapStateToProps, null)
class LoginInfura extends Component {
  constructor () {
    super()
    this.state = {
      step: SELECT_LOGIN_OPTION
    }
  }
  handleMnemonicLogin = (mnemonicKey) => {
    const web3 = new Web3()
    const { protocol, host } = getNetworkById(this.props.selectedNetworkId, providerMap.infura.id)
    const providerUrl = `${protocol}://${host}`
    web3Provider.setWeb3(web3)
    const provider = mnemonicProvider(mnemonicKey, providerUrl)
    web3Provider.setProvider(provider)
    this.setState({ step: SELECT_ACCOUNT })
  }

  render () {
    const { selectedNetworkId } = this.props
    const { step } = this.state
    return (
      <div>
        <NetworkSelector />
        {step === SELECT_LOGIN_OPTION && selectedNetworkId && <LoginMnemonic onLogin={this.handleMnemonicLogin} />}
        {step === SELECT_LOGIN_OPTION && selectedNetworkId && <LoginPrivateKey />}
        {step === SELECT_ACCOUNT && <AccountSelector onSelectAccount={() => this.props.onLogin()}/> }
      </div>
    )
  }
}

export default LoginInfura
