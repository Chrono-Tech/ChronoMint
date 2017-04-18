import React, { Component } from 'react'
import { connect } from 'react-redux'
import Web3ProvidersName from '../../../network/Web3ProviderNames'
import { setWeb3 } from '../../../redux/network/networkAction'
import { RaisedButton, TextField } from 'material-ui'
import styles from './styles'
import mnemonicProvider from '../../../network/MnemonicProvider'
import web3Provider from '../../../network/Web3Provider'
import Back from './Back'
import AccountSelector from './AccountSelector'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider
})

const mapDispatchToProps = (dispatch) => ({
  setWeb3: (providerName: Web3ProvidersName) => dispatch(setWeb3(providerName))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginMnemonic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mnemonicKey: 'couch solve unique spirit wine fine occur rhythm foot feature glory away',
      isProvider: false
    }
  }

  handleLoginClick = () => {
    this.props.setWeb3(Web3ProvidersName.MNEMONIC)
  }

  handleChange = () => {
    this.setState({mnemonicKey: this.mnemonicKey.getValue()})
  }

  handleProceedClick = () => {
    web3Provider.setProvider(mnemonicProvider(this.mnemonicKey.getValue()))
    this.setState({ isProvider: true })
  }

  render () {
    let result = null
    const {selectedProvider} = this.props
    const {isProvider, mnemonicKey} = this.state

    if (selectedProvider === null) {
      result = (
        <RaisedButton
          label={`Mnemonic Login`}
          primary
          fullWidth
          disabled={!window.web3}
          onTouchTap={this.handleLoginClick}
          style={styles.loginBtn} />
      )
    } else if (selectedProvider === Web3ProvidersName.MNEMONIC) {
      if (!isProvider) {
        result = (
          <div>
            <TextField
              ref={(input) => { this.mnemonicKey = input }}
              floatingLabelText='Mnemonic key'
              value={mnemonicKey}
              onChange={this.handleChange}
              fullWidth />
            <RaisedButton
              label='Proceed'
              primary
              fullWidth
              onTouchTap={this.handleProceedClick}
              style={styles.loginBtn} />
            <Back />
          </div>
        )
      } else {
        result = (
          <AccountSelector onSelectAccount={() => this.props.onLogin()} />
        )
      }
    }
    return result
  }
}

export default LoginMnemonic
