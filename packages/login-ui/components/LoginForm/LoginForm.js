/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import compose from 'recompose/compose'
import spinner from 'assets/img/spinningwheel-1.gif'
import React from 'react'
import { Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import UserRow from 'components/common/ui/UserRow/UserRow'
import { isLocalNode } from '@chronobank/login/network/settings'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import {
  getAccountAddress,
  getAccountAvatarImg,
  getAccountName,
} from '@chronobank/core/redux/persistAccount/utils'
import {
  DUCK_NETWORK,
} from '@chronobank/login/redux/network/constants'
import {
  initAccountsSignature,
} from '@chronobank/login/redux/network/thunks'
import {
  navigateToSelectWallet,
  navigateToRecoverAccountPage,
} from '../../redux/actions'
import {
  FORM_LOGIN_PAGE,
  FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE,
} from '../../redux/constants'
import {
  initLoginPage,
  onSubmitLoginForm,
  onSubmitLoginFormFail,
} from '../../redux/thunks'
import styles from './styles'
import './LoginForm.scss'

function mapStateToProps (state) {
  const network = state.get(DUCK_NETWORK)
  const selectedWallet = state.get(DUCK_PERSIST_ACCOUNT).selectedWallet
  const formSelector = formValueSelector(FORM_LOGIN_PAGE)

  return {
    accounts: network.accounts,
    isLocalNode: isLocalNode(network.selectedProviderId, network.selectedNetworkId),
    isLoginSubmitting: network.isLoginSubmitting,
    selectedAccount: network.selectedAccount,
    selectedNetworkId: network.selectedNetworkId,
    selectedProvider: network.selectedProviderId,
    selectedWallet: selectedWallet,
    successMessage: formSelector(state, FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: async (values) => {
      const password = values.get('password')
      await dispatch(onSubmitLoginForm(password))
    },
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitLoginFormFail(errors, submitErrors)),
    initLoginPage: async () => dispatch(initLoginPage()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    initAccountsSignature: () => dispatch(initAccountsSignature()),
    navigateToRecoverAccountPage: () => dispatch(navigateToRecoverAccountPage()),
  }
}

class LoginPage extends React.Component {
  static propTypes = {
    accounts: PropTypes.instanceOf(Array),
    initAccountsSignature: PropTypes.func,
    initLoginPage: PropTypes.func,
    isLocalNode: PropTypes.bool,
    isLoginSubmitting: PropTypes.bool,
    navigateToSelectWallet: PropTypes.func,
    selectedAccount: PropTypes.string,
    selectedWallet: PropTypes.object,
    successMessage: PropTypes.string,
  }

  componentWillMount () {
    this.props.initLoginPage()
  }

  renderSuccessMessage () {
    const { successMessage } = this.props

    if (!successMessage) {
      return null
    }

    return (
      <div styleName='success-message'>
        {successMessage}
      </div>
    )
  }

  render () {
    const {
      classes,
      error,
      handleSubmit,
      initialValues,
      isImportMode,
      isLocalNode,
      isLoginSubmitting,
      navigateToSelectWallet,
      navigateToRecoverAccountPage,
      onSubmit,
      pristine,
      selectedWallet,
      valid,
    } = this.props

    return (
      <form styleName='form' name={FORM_LOGIN_PAGE} onSubmit={handleSubmit}>
        <div styleName='page-title'>
          <Translate value='LoginForm.title' />
        </div>

        {this.renderSuccessMessage()}

        <input type='hidden' name={FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE} />

        <div styleName='user-row'>
          <UserRow
            title={getAccountName(selectedWallet)}
            subtitle={getAccountAddress(selectedWallet, true)}
            avatar={getAccountAvatarImg(selectedWallet)}
            onClick={navigateToSelectWallet}
            linkTitle='My Accounts'
          />

          <div styleName='field'>
            <Field
              component={TextField}
              name='password'
              type='password'
              label={<Translate value='LoginForm.enterPassword' />}
              fullWidth
              InputProps={{ className: classes.input }}
            />
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
              label={isLoginSubmitting
                ? (
                  <span styleName='spinner-wrapper'>
                    <img
                      src={spinner}
                      alt=''
                      width={24}
                      height={24}
                    />
                  </span>
                )
                : <Translate value='LoginForm.submitButton' />}
              disabled={isLoginSubmitting}
            />

            {error ? (<div styleName='form-error'>{error}</div>) : null}

            <button onClick={navigateToRecoverAccountPage} styleName='link'>
              <Translate value='LoginForm.forgotPassword' />
            </button>
          </div>
        </div>

      </form>
    )
  }
}

const form = reduxForm({ form: FORM_LOGIN_PAGE })(LoginPage)
export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(form)
