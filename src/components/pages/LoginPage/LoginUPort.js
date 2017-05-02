import React, { Component } from 'react'
import styles from './styles'
import { connect } from 'react-redux'
import { RaisedButton } from 'material-ui'
import web3Provider from '../../../network/Web3Provider'
import uportProvider from '../../../network/UportProvider'
import { addError, clearErrors, loadAccounts, selectAccount } from '../../../redux/network/actions'

const mapStateToProps = (state) => ({
  accounts: state.get('network').accounts,
  selectedAccount: state.get('network').selectedAccount
})

const mapDispatchToProps = (dispatch) => ({
  loadAccounts: () => dispatch(loadAccounts()),
  selectAccount: (account) => dispatch(selectAccount(account)),
  addError: (error) => dispatch(addError(error)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUPort extends Component {
  constructor () {
    super()
    this.state = {
      isUportInited: false
    }
  }

  handleLoginClick = () => {
    this.props.clearErrors()
    web3Provider.setWeb3(uportProvider.getWeb3())
    web3Provider.setProvider(uportProvider.getProvider())
    this.props.loadAccounts().then(() => {
      this.props.selectAccount(this.props.accounts[0])
      this.props.onLogin()
    }).catch(e => {
      this.props.addError(e.message)
    })
  }

  render () {
    return (
      <RaisedButton
          label={`Uport Login`}
          primary
          fullWidth
          onTouchTap={this.handleLoginClick}
          style={styles.loginBtn}/>
    )
  }
}

export default LoginUPort
