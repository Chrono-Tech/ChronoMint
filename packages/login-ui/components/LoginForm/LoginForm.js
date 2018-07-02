/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'
import NetworkSelector from '@chronobank/login-ui/components/NetworkSelector/NetworkSelector'
import ProviderSelector from '@chronobank/login-ui/components/ProviderSelector/ProviderSelector'

import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  onSubmitLoginForm,
  onSubmitLoginFormFail,
  initLoginPage,
  navigateToSelectWallet,
  initAccountsSignature,
  DUCK_NETWORK,
} from '@chronobank/login/redux/network/actions'
import {
  getNetworksWithProviders,
  getNetworkWithProviderNames,
  getProviderById,
  isTestRPC,
  LOCAL_ID,
  LOCAL_PROVIDER_ID,
  LOCAL_PRIVATE_KEYS,
} from '@chronobank/login/network/settings'
import {
  getAccountName,
  getAccountAvatar,
} from '@chronobank/core/redux/persistAccount/utils'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import networkService from '@chronobank/login/network/NetworkService'
import AutomaticProviderSelector from '@chronobank/login-ui/components/ProviderSelectorSwitcher/AutomaticProviderSelector'
import ManualProviderSelector from '@chronobank/login-ui/components/ProviderSelectorSwitcher/ManualProviderSelector'

import styles from 'layouts/Splash/styles'
import spinner from 'assets/img/spinningwheel-1.gif'
import './LoginForm.scss'
import classnames from "classnames";

const STRATEGY_MANUAL = 'manual'
const STRATEGY_AUTOMATIC = 'automatic'

const nextStrategy = {
  [STRATEGY_AUTOMATIC]: STRATEGY_MANUAL,
  [STRATEGY_MANUAL]: STRATEGY_AUTOMATIC,
}

export const FORM_LOGIN_PAGE = 'FormLoginPage'

function mapStateToProps (state) {
  const network = state.get(DUCK_NETWORK)
  const selectedWallet = state.get('persistAccount').selectedWallet

  return {
    selectedWallet: selectedWallet,
    isLoginSubmitting: state.get('network').isLoginSubmitting,
    selectedNetworkId: network.selectedNetworkId,
    selectedProvider: network.selectedProviderId,
    selectedAccount: network.selectedAccount,
    accounts: network.accounts,
    isTestRPC: isTestRPC(network.selectedProviderId, network.selectedNetworkId),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: async (values) => {
      const password = values.get('password')

      await dispatch(onSubmitLoginForm(password))
    },
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitLoginFormFail(errors, dispatch, submitErrors)),
    initLoginPage: async () => dispatch(initLoginPage()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    initAccountsSignature: () => dispatch(initAccountsSignature()),
  }
}

class LoginPage extends PureComponent {
  static propTypes = {
    initLoginPage: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
    isLoginSubmitting: PropTypes.bool,
    initAccountsSignature: PropTypes.func,
    accounts: PropTypes.array,
    selectedAccount: PropTypes.string,
    selectedWallet: PropTypes.object,
    isTestRPC: PropTypes.bool,
  }

  constructor(props){
    super(props)

    this.state = {
      open: false,
      anchorEl: null,
    }
  }

  componentWillMount(){
    this.props.initLoginPage()
  }

  handleSelect = async () => {
    const account = this.props.selectedAccount
    const index = Math.max(this.props.accounts.indexOf(account), 0)
    const provider = privateKeyProvider.getPrivateKeyProvider(LOCAL_PRIVATE_KEYS[index], networkService.getProviderSettings(), this.props.wallets)
    await networkService.setup(provider)
  }

  handleChange = (event, index, value) => {
    this.props.selectAccount(value)
  }

  defaultLoginFormFields(){
    const { selectedWallet, navigateToSelectWallet } = this.props

    return (
      <div>
        <UserRow
          title={getAccountName(selectedWallet)}
          avatar={getAccountAvatar(selectedWallet)}
          onClick={navigateToSelectWallet}
        />

        <div styleName='field'>
          <Field
            component={TextField}
            name='password'
            type='password'
            floatingLabelText={<Translate value='LoginForm.enterPassword' />}
            fullWidth
            {...styles.textField}
          />
        </div>
      </div>
    )
  }

  renderSelectRPCAccount(){
    const { accounts } = this.props

    return (
      <div styleName='selectRPCAccount'>
        <Button
          styleName='langButton'
          onClick={this.handleClickRPCSelectorButton}
        >
          { selectedProvider && selectedProvider.name }
        </Button>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleRequestRPCSelectorPopoverClose}
          style={{
            background: 'transparent'
          }}
        >
          <ul styleName='providersList'>
            {accounts.map((item, i) => this.renderRPCSelectorMenuItem(item, i))}
          </ul>
        </Popover>
      </div>
    )
  }

  renderRPCSelectorMenuItem(item, i){
    const { selectedAccount } = this.props

    return (
      <li
        styleName={classnames({providerItem: true, providerItemActive: checked })}
        onClick={() => this.handleClick(item)}
        key={i}
      >
        {this.getFullNetworkName(item)}
      </li>
    )
  }

  handleClickRPCSelectorButton = (event) => {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestRPCSelectorPopoverClose = () => {
    this.setState({
      open: false,
    })
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues, isImportMode, error, onSubmit, selectedWallet,
      navigateToSelectWallet, isLoginSubmitting, isTestRPC } = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={FORM_LOGIN_PAGE} onSubmit={handleSubmit}>

          <div styleName='page-title'>
            <Translate value='LoginForm.title' />
          </div>

          <div styleName='user-row'>
            { isTestRPC ? }

            <div styleName='actions'>
              <Button
                styleName='button'
                buttonType='login'
                type='submit'
                label={isLoginSubmitting
                  ? <span styleName='spinner-wrapper'>
                    <img
                      src={spinner}
                      alt=''
                      width={24}
                      height={24}
                    />
                  </span> : <Translate value='LoginForm.submitButton' />}
                disabled={isLoginSubmitting}
              />

              { error ? (<div styleName='form-error'>{error}</div>) : null }

              <Link to='/login/recover-account' href styleName='link'>
                <Translate value='LoginForm.forgotPassword' />
              </Link>
            </div>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_LOGIN_PAGE })(LoginPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
