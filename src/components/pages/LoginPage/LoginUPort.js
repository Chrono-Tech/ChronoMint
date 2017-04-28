import React, { Component } from 'react'
import styles from './styles'
import { connect } from 'react-redux'
import { RaisedButton } from 'material-ui'
import AccountSelector from './AccountSelector'
import web3Provider from '../../../network/Web3Provider'
import uportProvider from '../../../network/UportProvider'
import { addError, clearErrors, loadAccounts } from '../../../redux/network/actions'

const mapStateToProps = (state) => ({
  selectedAccount: state.get('network').selectedAccount
})

const mapDispatchToProps = (dispatch) => ({
  loadAccounts: () => dispatch(loadAccounts()),
  addError: (error) => dispatch(addError(error)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUPort extends Component {
  constructor () {
    super()
    this.state = {
      isWeb3: false
    }
  }

  handleLoginClick = () => {
    this.props.clearErrors()
    web3Provider.setWeb3(uportProvider.getWeb3())
    web3Provider.setProvider(uportProvider.getProvider())
    this.props.loadAccounts().then((accounts) => {
      console.log('--LoginUPort#', accounts)
    }).catch(e => {
      this.props.addError(e.message)
    })
    // TODO @dkchv: wait for invite from uport.me
  }

  render () {
    const { selectedAccount, accounts } = this.props
    const { isWeb3 } = this.state
    return (
      <div>
        {isWeb3 && <AccountSelector accounts={accounts} onSelectAccount={() => this.props.onLogin()} />}
        {!isWeb3 && <RaisedButton
          label={`Uport Login`}
          primary
          fullWidth
          onTouchTap={this.handleLoginClick}
          style={styles.loginBtn}/>}
      </div>
    )
  }
}

export default LoginUPort
