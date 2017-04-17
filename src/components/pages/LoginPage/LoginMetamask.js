import React, { Component } from 'react'
import {connect} from 'react-redux'
import { RaisedButton } from 'material-ui'
import styles from './styles'
import Web3ProvidersName from '../../../network/Web3ProviderNames'
import { setWeb3Provider } from '../../../redux/network/networkAction'
import AccountSelector from './AccountSelector'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider
})

const mapDispatchToProps = (dispatch) => ({
  setWeb3Provider: (providerName: Web3ProvidersName) => dispatch(setWeb3Provider(providerName))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginMetamask extends Component {
  handleLoginClick = () => {
    this.props.setWeb3Provider(Web3ProvidersName.METAMASK)
  }

  render () {
    let result = null
    const { selectedProvider } = this.props

    if (selectedProvider === null) {
      const providerName = window.web3 && window.web3.currentProvider.isMetaMask
        ? 'MetaMask'
        : 'Mist'
      result = (
        <RaisedButton label={`${providerName} Login`}
          primary
          fullWidth
          disabled={!window.web3}
          onTouchTap={this.handleLoginClick}
          style={styles.loginBtn} />
      )
    } else if (selectedProvider === Web3ProvidersName.METAMASK) {
      result = (
        <AccountSelector onSelectAccount={() => this.props.onLogin()} />
      )
    }
    return result
  }
}

export default LoginMetamask
