import React, {Component} from 'react'
import { List, ListItem, Paper } from 'material-ui'
import {connect} from 'react-redux'
import {login} from '../redux/session/actions'
import LoginMetamask from '../components/pages/LoginPage/LoginMetamask'
import styles from '../components/pages/LoginPage/styles'
import LoginLocal from '../components/pages/LoginPage/LoginLocal'
// import LoginUPort from '../components/pages/LoginPage/LoginUPort'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { yellow800 } from 'material-ui/styles/colors'
// import LoginMnemonic from '../components/pages/LoginPage/LoginMnemonic'
// import LoginPrivateKey from '../components/pages/LoginPage/LoginPrivateKey'
import { checkNetworkAndLogin, selectNetwork, selectAccount, selectProvider } from '../redux/network/networkAction'
import NetworkSelector from '../components/pages/LoginPage/NetworkSelector'
import ProviderSelector from '../components/pages/LoginPage/ProviderSelector'
import { providerMap } from '../network/networkSettings'
import ls from '../utils/localStorage'
import localStorageKeys from '../constants/localStorageKeys'

const mapStateToProps = (state) => ({
  errors: state.get('network').errors,
  selectedAccount: state.get('network').selectedAccount,
  selectedNetworkId: state.get('network').selectedNetworkId,
  selectedProviderId: state.get('network').selectedProviderId
})

const mapDispatchToProps = (dispatch) => ({
  handleLogin: (account) => dispatch(login(account, true)),
  checkNetworkAndLogin: (account) => dispatch(checkNetworkAndLogin(account)),
  selectAccount: (account) => dispatch(selectAccount(account)),
  selectNetwork: (networkId) => dispatch(selectNetwork(networkId)),
  selectProvider: (providerId) => dispatch(selectProvider(providerId))
})

@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  componentWillMount () {
    const providerId = ls(localStorageKeys.WEB3_PROVIDER)
    const networkId = ls(localStorageKeys.NETWORK_ID)
    const account = ls(localStorageKeys.ACCOUNT)
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
    this.props.checkNetworkAndLogin(this.props.selectedAccount)
  }

  render () {
    const { errors, selectedNetworkId, selectedProviderId } = this.props
    return (
      <div style={styles.loginContainer}>
        <Paper style={styles.paper}>
          <NetworkSelector />
          {selectedNetworkId && <ProviderSelector />}
          {selectedProviderId === providerMap.metamask.id && <LoginMetamask onLogin={this.handleLogin} />}
          {selectedProviderId === providerMap.local.id && <LoginLocal onLogin={this.handleLogin} />}
          {/*<LoginUPort onLogin={this.handleLogin} />*/}
          {/*<LoginMnemonic onLogin={this.handleLogin} />*/}
          {/*<LoginPrivateKey onLogin={this.handleLogin} />*/}
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
