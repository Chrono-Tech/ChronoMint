import React, { Component } from 'react'
import { List, ListItem, Paper } from 'material-ui'
import { connect } from 'react-redux'
import LoginMetamask from '../components/pages/LoginPage/LoginMetamask'
import styles from '../components/pages/LoginPage/styles'
import LoginLocal from '../components/pages/LoginPage/LoginLocal'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { yellow800 } from 'material-ui/styles/colors'
import { checkNetworkAndLogin, clearErrors } from '../redux/network/actions'
import ProviderSelector from '../components/pages/LoginPage/ProviderSelector'
import { providerMap } from '../network/networkSettings'
import LoginInfura from '../components/pages/LoginPage/LoginInfura'
import LoginUPort from '../components/pages/LoginPage/LoginUPort'

const mapStateToProps = (state) => ({
  errors: state.get('network').errors,
  selectedAccount: state.get('network').selectedAccount,
  selectedProviderId: state.get('network').selectedProviderId,
  selectedNetworkId: state.get('network').selectedNetworkId
})

const mapDispatchToProps = (dispatch) => ({
  checkNetworkAndLogin: (account) => dispatch(checkNetworkAndLogin(account)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  handleLogin = () => {
    this.props.clearErrors()
    this.props.checkNetworkAndLogin(this.props.selectedAccount)
  }

  render () {
    const { errors, selectedProviderId } = this.props
    return (
      <div style={styles.loginWrapper}>
        <div style={styles.loginContainer}>
          <a href='//beta.chronobank.io' style={styles.logo}>
            <div style={styles.logo__img} />
            <div style={styles.logo__chrono}>Chrono<span style={styles.logo__bank}>bank.io</span><sup style={styles.logo__beta}>beta</sup></div>
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
