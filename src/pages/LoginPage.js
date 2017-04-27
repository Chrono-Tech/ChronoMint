import React, { Component } from 'react'
import { List, ListItem, Paper } from 'material-ui'
import { connect } from 'react-redux'
import { login } from '../redux/session/actions'
import LoginMetamask from '../components/pages/LoginPage/LoginMetamask'
import styles from '../components/pages/LoginPage/styles'
import LoginLocal from '../components/pages/LoginPage/LoginLocal'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { yellow800 } from 'material-ui/styles/colors'
import { checkNetworkAndLogin, selectNetwork, selectAccount, selectProvider, clearErrors } from '../redux/network/networkAction'
import ProviderSelector from '../components/pages/LoginPage/ProviderSelector'
import { providerMap } from '../network/networkSettings'
import LS from '../dao/LocalStorageDAO'
import LoginInfura from '../components/pages/LoginPage/LoginInfura'

const mapStateToProps = (state) => ({
  errors: state.get('network').errors,
  selectedAccount: state.get('network').selectedAccount,
  selectedProviderId: state.get('network').selectedProviderId,
  selectedNetworkId: state.get('network').selectedNetworkId
})

const mapDispatchToProps = (dispatch) => ({
  handleLogin: (account) => dispatch(login(account, true)),
  checkNetworkAndLogin: (account) => dispatch(checkNetworkAndLogin(account)),
  selectAccount: (account) => dispatch(selectAccount(account)),
  selectNetwork: (networkId) => dispatch(selectNetwork(networkId)),
  selectProvider: (providerId) => dispatch(selectProvider(providerId)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  componentWillMount () {
    const account = LS.getAccount()
    const networkId = LS.getNetworkId()
    const providerId = LS.getWeb3Provider()
    if (providerId) {
      this.props.selectProvider(providerId)
    }
    if (networkId) {
      this.props.selectNetwork(networkId)
    }
    if (account) {
      this.props.selectAccount(account)
    }
  }

  handleLogin = () => {
    this.props.clearErrors()
    this.props.checkNetworkAndLogin(this.props.selectedAccount)
  }

  render () {
    const { errors, selectedProviderId } = this.props
    return (
      <div style={styles.loginContainer}>
        <Paper style={styles.paper}>
          <ProviderSelector />
          {selectedProviderId === providerMap.metamask.id && <LoginMetamask onLogin={this.handleLogin} />}
          {selectedProviderId === providerMap.local.id && <LoginLocal onLogin={this.handleLogin} />}
          {selectedProviderId === providerMap.infura.id && <LoginInfura onLogin={this.handleLogin} />}

          {errors && (
            <List>
              {errors.map((error, index) => (
                <ListItem
                  key={index}
                  leftIcon={<WarningIcon color={yellow800} />}
                  primaryText={error} />
              ))}
            </List>
          )}
        </Paper>
      </div>
    )
  }
}

export default Login
