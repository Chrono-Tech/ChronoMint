import React, {Component} from 'react'
import { Paper } from 'material-ui'
import {connect} from 'react-redux'
import {login} from '../redux/session/actions'
import {setWeb3Provider, selectAccount, loadAccounts, clearWeb3Provider} from '../redux/network/networkAction'
import LoginMetamask from '../components/pages/LoginPage/LoginMetamask'
import styles from '../components/pages/LoginPage/styles'
import LoginLocal from '../components/pages/LoginPage/LoginLocal'
import AccountSelector from '../components/pages/LoginPage/AccountSelector'
import Web3ProvidersName from '../network/Web3ProviderNames'

// TODO: Fix https://github.com/callemall/material-ui/issues/3923

const mapStateToProps = (state) => ({
  accounts: state.get('network').accounts,
  error: state.get('network').error,
  selectedProvider: state.get('network').selectedProvider,
  selectedAccount: state.get('network').selectedAccount
})

const mapDispatchToProps = (dispatch) => ({
  handleLogin: (account) => dispatch(login(account, true)),
  setWeb3Provider: (providerName: Web3ProvidersName) => dispatch(setWeb3Provider(providerName)),
  selectAccount: (value) => dispatch(selectAccount(value)),
  loadAccounts: () => dispatch(loadAccounts()),
  clearWeb3Provider: () => dispatch(clearWeb3Provider())
})

@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  handleChange = (event, index, value) => {
    this.props.selectAccount(value)
  }

  handleSelectAccount = () => {
    this.props.handleLogin(this.props.selectedAccount)
  }

  handleBackClick = () => {
    this.props.clearWeb3Provider()
  }

  handleLocalLogin = () => {
    this.props.setWeb3Provider(Web3ProvidersName.LOCAL)
    this.props.loadAccounts()
  }

  handleMetamaskLogin = () => {
    this.props.setWeb3Provider(Web3ProvidersName.METAMASK)
    this.props.loadAccounts()
  }

  render () {
    const {accounts, selectedAccount, selectedProvider, error} = this.props
    return (
      <div style={styles.loginContainer}>
        <Paper style={styles.paper}>
          {error}
          {!selectedProvider && (
            <div>
              <LoginLocal onClick={this.handleLocalLogin}/>
              <LoginMetamask onClick={this.handleMetamaskLogin} />
            </div>)
          }
          {(selectedProvider === Web3ProvidersName.LOCAL ||
            selectedProvider === Web3ProvidersName.METAMASK) &&
            <AccountSelector
              accounts={accounts}
              selected={selectedAccount}
              onChange={this.handleChange}
              onSelectAccount={this.handleSelectAccount}
              onBack={this.handleBackClick}/>
          }
        </Paper>
      </div>
    )
  }
}

export default Login
