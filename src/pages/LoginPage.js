import React, { Component } from 'react'
import { List, ListItem, Paper } from 'material-ui'
import { connect } from 'react-redux'
import LoginMetamask from '../components/pages/LoginPage/LoginMetamask'
import styles from '../components/pages/LoginPage/styles'
import LoginLocal from '../components/pages/LoginPage/LoginLocal'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { yellow800 } from 'material-ui/styles/colors'
import { checkNetwork, clearErrors, createNetworkSession } from '../redux/network/actions'
import ProviderSelector from '../components/pages/LoginPage/ProviderSelector'
import { providerMap } from '../network/settings'
import LoginInfura from '../components/pages/LoginPage/LoginInfura'
import LoginUPort from '../components/pages/LoginPage/LoginUPort'
import { login } from '../redux/session/actions'

const mapStateToProps = (state) => ({
  errors: state.get('network').errors,
  selectedAccount: state.get('network').selectedAccount,
  selectedProviderId: state.get('network').selectedProviderId,
  selectedNetworkId: state.get('network').selectedNetworkId
})

const mapDispatchToProps = (dispatch) => ({
  checkNetwork: () => dispatch(checkNetwork()),
  createNetworkSession: (account, provider, network) => dispatch(createNetworkSession(account, provider, network)),
  login: (account) => dispatch(login(account)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  handleLogin = () => {
    this.props.clearErrors()
    this.props.checkNetwork(
      this.props.selectedAccount,
      this.props.selectedProviderId,
      this.props.selectedNetworkId
    ).then((isPassed) => {
      if (isPassed) {
        this.props.createNetworkSession(
          this.props.selectedAccount,
          this.props.selectedProviderId,
          this.props.selectedNetworkId
        )
        this.props.login(this.props.selectedAccount)
      }
    })
  }

  render () {
    const {errors, selectedProviderId} = this.props
    return (
      <div style={styles.loginWrapper}>
        <div style={styles.loginContainer}>
          <a href='//beta.chronobank.io' style={styles.logo}>
            <div style={styles.logo__img} />
            <div>
              <span style={styles.logo__chrono}>Chrono</span>
              <span style={styles.logo__bank}>bank.io</span>
              <sup style={styles.logo__beta}>beta</sup>
            </div>
          </a>
          <Paper style={styles.paper}>
            <ProviderSelector />
            {selectedProviderId === providerMap.metamask.id && <LoginMetamask onLogin={this.handleLogin} />}
            {selectedProviderId === providerMap.local.id && <LoginLocal onLogin={this.handleLogin} />}
            {selectedProviderId === providerMap.infura.id && <LoginInfura onLogin={this.handleLogin} />}
            {selectedProviderId === providerMap.uport.id && <LoginUPort onLogin={this.handleLogin} />}

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
      </div>
    )
  }
}

export default Login
