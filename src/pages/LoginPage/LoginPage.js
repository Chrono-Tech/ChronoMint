import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import LoginMetamask from '../../components/pages/LoginPage/LoginMetamask/LoginMetamask'
import LoginLocal from '../../components/pages/LoginPage/LoginLocal/LoginLocal'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import {yellow800} from 'material-ui/styles/colors'
import {checkNetwork, clearErrors, createNetworkSession, loading} from '../../redux/network/actions'
import ProviderSelector from 'components/pages/LoginPage/ProviderSelector/ProviderSelector'
import {providerMap} from 'network/settings'
import LoginWithOptions from 'components/pages/LoginPage/LoginWithOptions/LoginWithOptions'
import LoginUPort from 'components/pages/LoginPage/LoginUPort/LoginUPort'
import {login} from 'redux/session/actions'
import {MuiThemeProvider} from 'material-ui'
import inverted from 'styles/themes/inversed'
import LocaleDropDown from 'layouts/partials/LocaleDropDown'
import './LoginPage.scss'

const mapStateToProps = (state) => {
  const network = state.get('network')
  return {
    errors: network.errors,
    selectedAccount: network.selectedAccount,
    selectedProviderId: network.selectedProviderId,
    selectedNetworkId: network.selectedNetworkId,
    isLoading: network.isLoading
  }
}

const mapDispatchToProps = (dispatch) => ({
  checkNetwork: () => dispatch(checkNetwork()),
  createNetworkSession: (account, provider, network) => dispatch(createNetworkSession(account, provider, network)),
  login: (account) => dispatch(login(account)),
  clearErrors: () => dispatch(clearErrors()),
  loading: () => dispatch(loading())
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
    errors: PropTypes.array
  }

  constructor () {
    super()
    this.state = {
      isShowProvider: true
    }
  }

  handleLogin = async () => {
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

  handleToggleProvider = (isShowProvider) => {
    this.setState({isShowProvider})
  }

  render () {
    const {errors, selectedProviderId} = this.props
    return (
      <MuiThemeProvider muiTheme={inverted}>
        <div styleName='form'>
          <div styleName='title'>Login</div>
          <div styleName='subtitle'>Welcome back!</div>
          {this.state.isShowProvider && <ProviderSelector/>}
          {selectedProviderId === providerMap.metamask.id && <LoginMetamask onLogin={this.handleLogin}/>}
          {selectedProviderId === providerMap.local.id && <LoginLocal onLogin={this.handleLogin}/>}
          {(selectedProviderId === providerMap.infura.id || selectedProviderId === providerMap.chronoBank.id) && (
            <LoginWithOptions
              onLogin={this.handleLogin}
              onToggleProvider={this.handleToggleProvider}/>
          )}
          {selectedProviderId === providerMap.uport.id && <LoginUPort onLogin={this.handleLogin}/>}

          {errors && (
            <div styleName='errors'>
              {errors.map((error, index) => (
                <div styleName='error' key={index}>
                  <div styleName='errorIcon'><WarningIcon color={yellow800}/></div>
                  <div styleName='errorText'>{error}</div>
                </div>
              ))}
            </div>
          )}
          <ul styleName='actions'>
            <li>
              <LocaleDropDown/>
            </li>
          </ul>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default LoginPage
