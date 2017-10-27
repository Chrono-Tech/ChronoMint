import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import networkService, { clearErrors, loading } from 'Login/redux/network/actions'
import LoginMetamask from 'Login/components/LoginMetamask/LoginMetamask'
import LoginLocal from 'Login/components/LoginLocal/LoginLocal'
import LoginWithOptions from 'Login/components/LoginWithOptions/LoginWithOptions'
import LoginUPort from 'Login/components/LoginUPort/LoginUPort'
import ProviderSelector from 'Login/components/ProviderSelector/ProviderSelector'
import { providerMap } from 'Login/network/settings'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { yellow800 } from 'material-ui/styles/colors'
import { Translate } from 'react-redux-i18n'
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
  checkNetwork: () => networkService.checkNetwork(),
  createNetworkSession: (account, provider, network) => networkService.createNetworkSession(account, provider, network),
  login: account => networkService.login(account),
  clearErrors: () => dispatch(clearErrors()),
  loading: () => dispatch(loading()),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginForm extends Component {
  static propTypes = {
    clearErrors: PropTypes.func,
    checkNetwork: PropTypes.func,
    createNetworkSession: PropTypes.func,
    login: PropTypes.func,
    selectedAccount: PropTypes.string,
    selectedProviderId: PropTypes.number,
    selectedNetworkId: PropTypes.number,
    errors: PropTypes.array,
  }

  constructor () {
    super()
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
    const {errors, selectedProviderId} = this.props

    return (
      <div styleName='form'>
        <div styleName='title'><Translate value='LoginPage.title' /></div>
        <div styleName='subtitle'><Translate value='LoginPage.subTitle' /></div>
        {this.state.isShowProvider && <ProviderSelector />}
        {selectedProviderId === providerMap.metamask.id && <LoginMetamask onLogin={() => this.handleLogin()} />}
        {selectedProviderId === providerMap.local.id && <LoginLocal onLogin={() => this.handleLogin()} />}
        {(selectedProviderId === providerMap.infura.id || selectedProviderId === providerMap.chronoBank.id) && (
          <LoginWithOptions
            onLogin={() => this.handleLogin()}
            onToggleProvider={this.handleToggleProvider}
          />
        )}
        {selectedProviderId === providerMap.uport.id && <LoginUPort onLogin={() => this.handleLogin()} />}

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
      </div>
    )
  }
}

export default LoginForm
