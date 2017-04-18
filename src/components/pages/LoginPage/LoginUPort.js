import React, { Component } from 'react'
import styles from './styles'
import {connect} from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'
import Web3ProvidersName from '../../../network/Web3ProviderNames'
import { clearWeb3Provider, loadAccounts, setWeb3 } from '../../../redux/network/networkAction'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import globalStyles from '../../../styles'
import web3Provider from '../../../network/Web3Provider'
import uportProvider from '../../../network/UportProvider'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider
})

const mapDispatchToProps = (dispatch) => ({
  clearWeb3Provider: () => dispatch(clearWeb3Provider()),
  setWeb3: (providerName: Web3ProvidersName) => dispatch(setWeb3(providerName)),
  loadAccounts: () => dispatch(loadAccounts())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUPort extends Component {
  handleLoginClick = () => {
    this.props.setWeb3(Web3ProvidersName.UPORT)
    web3Provider.setProvider(uportProvider.getProvider())
    this.props.loadAccounts()
  }

  handleBackClick = () => {
    this.props.clearWeb3Provider()
  }

  render () {
    let result = null
    const { selectedProvider } = this.props

    if (selectedProvider === null) {
      result = (
        <RaisedButton label={`Uport Login`}
          primary
          fullWidth
          onTouchTap={this.handleLoginClick}
          style={styles.loginBtn} />
      )
    } else if (selectedProvider === Web3ProvidersName.UPORT) {
      result = (
        <div>
          <h3 style={globalStyles.title}>Login with UPort</h3>
          <FlatButton
            label='Back'
            onTouchTap={this.handleBackClick}
            style={styles.backBtn}
            icon={<ArrowBack />} />
        </div>
      )
    }
    return result
  }
}

export default LoginUPort
