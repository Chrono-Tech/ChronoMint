import React, { Component } from 'react'
import styles from './styles'
import { connect } from 'react-redux'
import { RaisedButton } from 'material-ui'
import Web3ProvidersName from '../../../network/Web3ProviderNames'
import { clearWeb3Provider, loadAccounts } from '../../../redux/network/networkAction'
import globalStyles from '../../../styles'

const mapStateToProps = (state) => ({
  selectedProvider: state.get('network').selectedProvider
})

const mapDispatchToProps = (dispatch) => ({
  clearWeb3Provider: () => dispatch(clearWeb3Provider()),
  // setWeb3: (providerName: Web3ProvidersName) => dispatch(setWeb3(providerName)),
  // setWeb3Provider: (providerName: Web3ProvidersName) => dispatch(setWeb3ProviderByName(providerName)),
  loadAccounts: () => dispatch(loadAccounts())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUPort extends Component {
  handleLoginClick = () => {
    // this.props.setWeb3(Web3ProvidersName.UPORT)
    // this.props.setWeb3Provider(Web3ProvidersName.UPORT)
    // this.props.loadAccounts()
  }

  render () {
    let result = null
    const {selectedProvider} = this.props

    if (selectedProvider === null) {
      result = (
        <RaisedButton label={`Uport Login`}
                      primary
                      fullWidth
                      onTouchTap={this.handleLoginClick}
                      style={styles.loginBtn}/>
      )
    } else if (selectedProvider === Web3ProvidersName.UPORT) {
      result = (
        <div>
          <h3 style={globalStyles.title}>Login with UPort</h3>
        </div>
      )
    }
    return result
  }
}

export default LoginUPort
