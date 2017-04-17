import React, { Component } from 'react'
import {connect} from 'react-redux'
import styles from './styles'
import { RaisedButton } from 'material-ui'
import { checkTestRPC, setWeb3 } from '../../../redux/network/networkAction'
import Web3ProvidersName from '../../../network/Web3ProviderNames'
import AccountSelector from './AccountSelector'
import Web3 from 'web3'
import web3Provider from '../../../network/Web3Provider'

const mapStateToProps = (state) => ({
  isTestRPC: state.get('network').isTestRPC,
  selectedProvider: state.get('network').selectedProvider
})

const mapDispatchToProps = (dispatch) => ({
  checkRPC: () => dispatch(checkTestRPC()),
  setWeb3: (providerName: Web3ProvidersName) => dispatch(setWeb3(providerName))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginLocal extends Component {
  componentWillMount () {
    this.props.checkRPC()
  }

  handleLoginClick = () => {
    this.props.setWeb3(Web3ProvidersName.LOCAL)
    const provider = new Web3.providers.HttpProvider('http://localhost:8545')
    web3Provider.setProvider(provider)
  }

  render () {
    let result = null
    const { selectedProvider } = this.props

    if (selectedProvider === null) {
      result = (
        <RaisedButton label='Local (TestRPC) Login'
          primary
          fullWidth
          disabled={!this.props.isTestRPC}
          onTouchTap={this.handleLoginClick}
          style={styles.loginBtn} />
      )
    } else if (selectedProvider === Web3ProvidersName.LOCAL) {
      result = (
        <AccountSelector onSelectAccount={() => this.props.onLogin()} />
      )
    }
    return result
  }
}

export default LoginLocal
