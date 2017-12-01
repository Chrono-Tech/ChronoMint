import { MD5 } from 'crypto-js'
import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'
import { MuiThemeProvider } from 'material-ui'
import { yellow800 } from 'material-ui/styles/colors'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { login } from 'redux/session/actions'
import inverted from 'styles/themes/inversed'
import LoginWithOptions from '../components/LoginWithOptions/LoginWithOptions'
import ManualProviderSelector from '../components/ProviderSelectorSwitcher/ManualProviderSelector'
import AutomaticProviderSelector from '../components/ProviderSelectorSwitcher/AutomaticProviderSelector'
import networkService, { clearErrors, DUCK_NETWORK } from '../redux/network/actions'

import './LoginPage.scss'

const STRATEGY_MANUAL = 'manual'
const STRATEGY_AUTOMATIC = 'automatic'

const nextStrategy = {
  [STRATEGY_AUTOMATIC]: STRATEGY_MANUAL,
  [STRATEGY_MANUAL]: STRATEGY_AUTOMATIC,
}

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)
  return {
    errors: network.errors,
    selectedAccount: network.selectedAccount,
    selectedProviderId: network.selectedProviderId,
    selectedNetworkId: network.selectedNetworkId,
    isLoading: network.isLoading,
  }
}

const mapDispatchToProps = (dispatch) => ({
  checkNetwork: () => networkService.checkNetwork(),
  createNetworkSession: (account, provider, network) => networkService.createNetworkSession(account, provider, network),
  login: (account) => dispatch(login(account)),
  clearErrors: () => dispatch(clearErrors()),
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
      strategy: STRATEGY_AUTOMATIC,
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

  handleToggleProvider = (isShowProvider) => this.setState({ isShowProvider })

  handleSelectorSwitch = (currentStrategy) => this.setState({ strategy: nextStrategy[currentStrategy] })

  renderError = (error) => (
    <div styleName='error' key={MD5(error)}>
      <div styleName='errorIcon'><WarningIcon color={yellow800} /></div>
      <div styleName='errorText'>{error}</div>
    </div>
  )

  renderProviderSelector () {
    switch (this.state.strategy) {
      case STRATEGY_MANUAL:
        return this.renderManualProviderSelector()
      case STRATEGY_AUTOMATIC:
        return this.renderAutomaticProviderSelector()
      default:
        return null
    }
  }

  renderAutomaticProviderSelector () {
    return (
      <AutomaticProviderSelector
        currentStrategy={this.state.strategy}
        onSelectorSwitch={this.handleSelectorSwitch}
      />
    )
  }

  renderManualProviderSelector () {
    return (
      <ManualProviderSelector
        show={this.state.isShowProvider}
        currentStrategy={this.state.strategy}
        onSelectorSwitch={this.handleSelectorSwitch}
      />
    )
  }

  render () {
    const {
      errors,
    } = this.props

    return (
      <MuiThemeProvider muiTheme={inverted}>
        <div styleName='form'>
          <div styleName='title'><Translate value='LoginPage.title' /></div>
          <div styleName='subtitle'><Translate value='LoginPage.subTitle' /></div>
          {this.renderProviderSelector()}
          <LoginWithOptions
            onLogin={this.handleLogin}
            onToggleProvider={this.handleToggleProvider}
          />
          {errors && (
            <div styleName='errors'>
              {errors.map(this.renderError)}
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
