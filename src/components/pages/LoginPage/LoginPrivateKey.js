import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RaisedButton, TextField } from 'material-ui'
import styles from './styles'
import Web3ProvidersName from '../../../network/Web3ProviderNames'
import { setWeb3 } from '../../../redux/network/networkAction'
import web3Provider from '../../../network/Web3Provider'
import privateKeyProvider from '../../../network/PrivateKeyProvider'
import Back from './Back'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider
})

const mapDispatchToProps = (dispatch) => ({
  setWeb3: (providerName: Web3ProvidersName) => dispatch(setWeb3(providerName))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginPrivateKey extends Component {
  handleLoginClick = () => {
    this.props.setWeb3(Web3ProvidersName.PRIVATE_KEY)
  }

  handleProceedClick = () => {
    web3Provider.setProvider(privateKeyProvider(this.privateKey.getValue()))
    this.props.onLogin()
  }

  render () {
    let result = null
    const {selectedProvider} = this.props

    if (selectedProvider === null) {
      result = (
        <RaisedButton
          label={`Private key Login`}
          primary
          fullWidth
          onTouchTap={this.handleLoginClick}
          style={styles.loginBtn} />
      )
    } else if (selectedProvider === Web3ProvidersName.PRIVATE_KEY) {
      result = (
        <div>
          <TextField
            ref={(input) => { this.privateKey = input }}
            floatingLabelText='Ethereum private key'
            fullWidth={ true }>
          </TextField>
          <RaisedButton
            label='Proceed'
            primary={ true }
            fullWidth={ true }
            onTouchTap={this.handleProceedClick}
            style={ styles.loginBtn }/>
          <Back />
        </div>
      )
    }
    return result
  }
}

export default LoginPrivateKey
