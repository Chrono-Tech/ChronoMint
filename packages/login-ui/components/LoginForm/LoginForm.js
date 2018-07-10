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

import {
  onSubmitLoginForm,
  onSubmitLoginFormFail,
  initLoginPage,
  navigateToSelectWallet,
  initAccountsSignature,
  DUCK_NETWORK,
  FORM_LOGIN_PAGE,
} from '@chronobank/login/redux/network/actions'
import {
  isTestRPC,
} from '@chronobank/login/network/settings'
import {
  getAccountName,
  getAccountAvatar,
} from '@chronobank/core/redux/persistAccount/utils'

import styles from 'layouts/Splash/styles'
import spinner from 'assets/img/spinningwheel-1.gif'
import './LoginForm.scss'

function mapStateToProps (state) {
  const network = state.get(DUCK_NETWORK)
  const selectedWallet = state.get('persistAccount').selectedWallet

  return {
    selectedWallet: selectedWallet,
    isLoginSubmitting: network.isLoginSubmitting,
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

  componentWillMount(){
    this.props.initLoginPage()
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues, isImportMode, error, onSubmit, selectedWallet,
      navigateToSelectWallet, isLoginSubmitting, isTestRPC } = this.props

    return (
      <MuiThemeProvider>
        <form styleName='form' name={FORM_LOGIN_PAGE} onSubmit={handleSubmit}>

          <div styleName='page-title'>
            <Translate value='LoginForm.title' />
          </div>

          <div styleName='user-row'>
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
