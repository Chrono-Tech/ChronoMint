import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'
import { MuiThemeProvider } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { connect } from 'react-redux'
import inverted from 'styles/themes/inversed'
import { yellow800 } from 'material-ui/styles/colors'

import { login } from 'redux/session/actions'

import LoginLocal from '../components/LoginLocal/LoginLocal'
import LoginMetamask from '../components/LoginMetamask/LoginMetamask'
import LoginUPort from '../components/LoginUPort/LoginUPort'
import LoginWithOptions from '../components/LoginWithOptions/LoginWithOptions'
import networkService, { loading, clearErrors } from '../redux/network/actions'
import { providerMap } from '../network/settings'
import ProviderSelector from '../components/ProviderSelector/ProviderSelector'

import './LoginPage.scss'

const mapStateToProps = state => {
  const network = state.get('network')
  return {
    errors: network.errors,
    selectedAccount: network.selectedAccount,
    selectedProviderId: network.selectedProviderId,
    selectedNetworkId: network.selectedNetworkId,
    isLoading: network.isLoading,
  }
}

const mapDispatchToProps = dispatch => ({
  checkNetwork: () => dispatch(networkService.checkNetwork()),
  createNetworkSession: (account, provider, network) => dispatch(networkService.createNetworkSession(account, provider, network)),
  login: account => dispatch(login(account)),
  clearErrors: () => dispatch(clearErrors()),
  loading: () => dispatch(loading()),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginPage extends Component {
  static propTypes = {
    clearErrors: PropTypes.func,
    checkNetwork: PropTypes.func,
    createNetworkSession: PropTypes.func,
    login: PropTypes.func,
    selectedAccount: PropTypes.string,
    selectedProviderId: PropTypes.number,
    selectedNetworkId: PropTypes.number,
    errors: PropTypes.arrayOf(PropTypes.string),
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    // TODO replace with async arrow when class properties will work correctly
    this.handleLogin = this.handleLogin.bind(this)
    this.state = {
      isShowProvider: true,
    }
  }

  async handleLogin () {
    this.props.clearErrors()
    const isPassed = await this.props.checkNetwork(
      this.props.selectedAccount,
      this.props.selectedProviderId,
      this.props.selectedNetworkId
    )
    if (isPassed) {
      this.props.createNetworkSession(
        this.props.selectedAccount,
        this.props.selectedProviderId,
        this.props.selectedNetworkId
      )
      this.props.login(this.props.selectedAccount)
    }
  }

  handleToggleProvider = isShowProvider => {
    this.setState({ isShowProvider })
  }

  render () {
    const {
      errors,
      selectedProviderId,
    } = this.props

    return (
      <MuiThemeProvider muiTheme={inverted}>
        <div styleName='form'>
          <div styleName='title'><Translate value='LoginPage.title' /></div>
          <div styleName='subtitle'><Translate value='LoginPage.subTitle' /></div>
          {this.state.isShowProvider && <ProviderSelector />}
          {selectedProviderId === providerMap.metamask.id && <LoginMetamask onLogin={this.handleLogin} />}
          {selectedProviderId === providerMap.local.id && <LoginLocal onLogin={this.handleLogin} />}
          {(selectedProviderId === providerMap.infura.id || selectedProviderId === providerMap.chronoBank.id) && (
            <LoginWithOptions
              onLogin={this.handleLogin}
              onToggleProvider={this.handleToggleProvider}
            />
          )}
          {selectedProviderId === providerMap.uport.id && <LoginUPort onLogin={this.handleLogin} />}

          {errors && (
            <div styleName='errors'>
              {errors.map((error, index) => (
                <div styleName='error' key={index}>
                  <div styleName='errorIcon'><WarningIcon color={yellow800} /></div>
                  <div styleName='errorText'>{error}</div>
                </div>
              ))}
            </div>
          )}
          <ul styleName='actions'>
            <li>
              <LocaleDropDown />
            </li>
          </ul>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default LoginPage
