import React, { Component } from 'react'
import { RaisedButton } from 'material-ui'
import styles from './styles'

class LoginMetamask extends Component {
  render () {
    const providerName = window.web3 && window.web3.currentProvider.isMetaMask
      ? 'MetaMask'
      : 'Mist'
    return (
      <div>
        <RaisedButton label={`${providerName} Login`}
          primary
          fullWidth
          onTouchTap={() => this.props.onClick()}
          disabled={!window.web3}
          style={styles.loginBtn} />
      </div>
    )
  }
}

export default LoginMetamask
