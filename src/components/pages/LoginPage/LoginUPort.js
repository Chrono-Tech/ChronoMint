import React, { Component } from 'react'
import styles from './styles'
import {connect} from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'
import Web3ProvidersName from '../../../network/Web3ProviderNames'
import { clearErrors, clearWeb3Provider, loadAccounts, setWeb3Provider } from '../../../redux/network/networkAction'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider
})

const mapDispatchToProps = (dispatch) => ({
  clearWeb3Provider: () => dispatch(clearWeb3Provider()),
  setWeb3Provider: (providerName: Web3ProvidersName) => dispatch(setWeb3Provider(providerName)),
  loadAccounts: () => dispatch(loadAccounts()),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUPort extends Component {
  handleLoginClick = () => {
    this.props.setWeb3Provider(Web3ProvidersName.UPORT)
    this.props.loadAccounts()
  }

  handleBackClick = () => {
    this.props.clearWeb3Provider()
    this.props.clearErrors()
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
          <div>Login with UPort</div>
          <FlatButton
            label="Back"
            onTouchTap={this.handleBackClick}
            style={styles.backBtn}
            icon={<ArrowBack />}/>
        </div>
      )
    }
    return result
  }
}

export default LoginUPort
