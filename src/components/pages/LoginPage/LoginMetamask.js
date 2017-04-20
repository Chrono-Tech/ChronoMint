import React, { Component } from 'react'
import {connect} from 'react-redux'
import { RaisedButton } from 'material-ui'
import styles from './styles'
import Web3ProvidersName from '../../../network/Web3ProviderNames'
import { setWeb3, setWeb3ProviderByName } from '../../../redux/network/networkAction'
import AccountSelector from './AccountSelector'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider,
  isMetaMask: state.get('network').isMetaMask
})

const mapDispatchToProps = (dispatch) => ({
  setWeb3: (providerName: Web3ProvidersName) => dispatch(setWeb3(providerName)),
  setWeb3Provider: (providerName: Web3ProvidersName) => dispatch(setWeb3ProviderByName(providerName))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginMetamask extends Component {
  handleLoginClick = () => {
    this.props.setWeb3(Web3ProvidersName.METAMASK)
    this.props.setWeb3Provider(Web3ProvidersName.METAMASK)
  }

  render () {
    let result = null
    const { selectedProvider, isMetaMask } = this.props

    if (selectedProvider === null) {
      result = (
        <RaisedButton label={`MetaMask/Mist Login`}
          primary
          fullWidth
          disabled={!isMetaMask}
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
