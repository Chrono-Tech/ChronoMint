import React, { Component } from 'react'
import {connect} from 'react-redux'
import styles from './styles'
import { RaisedButton } from 'material-ui'
import { checkTestRPC, setWeb3Provider } from '../../../redux/network/networkAction'
import Web3ProvidersName from '../../../network/Web3ProviderNames'
import AccountSelector from './AccountSelector'

const mapStateToProps = (state) => ({
  isTestRPC: state.get('network').isTestRPC,
  selectedProvider: state.get('network').selectedProvider
})

const mapDispatchToProps = (dispatch) => ({
  checkRPC: () => dispatch(checkTestRPC()),
  setWeb3Provider: (providerName: Web3ProvidersName) => dispatch(setWeb3Provider(providerName))
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginLocal extends Component {
  componentWillMount () {
    this.props.checkRPC()
  }

  handleLoginClick = () => {
    this.props.setWeb3Provider(Web3ProvidersName.LOCAL)
  }

  render () {
    let result = null
    const { selectedProvider } = this.props

    if (selectedProvider === null) {
      result = (
        <RaisedButton label='Local (TestRPC) Login'
          primary
          fullWidth
          disabled={!this.props.isTestRPC}
          onTouchTap={this.handleLoginClick}
          style={styles.loginBtn} />
      )
    } else if (selectedProvider === Web3ProvidersName.LOCAL) {
      result = (
        <AccountSelector onSelectAccount={() => this.props.onLogin()} />
      )
    }
    return result
  }
}

export default LoginLocal
