/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import compose from 'recompose/compose'
import React from 'react'
import { Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import {
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_LEDGER,
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_METAMASK,
} from '@chronobank/core/models/constants/AccountEntryModel'
import {
  getAccountAddress,
  getAccountAvatar,
  getAccountName,
} from '@chronobank/core/redux/persistAccount/utils'
import {
  DUCK_NETWORK,
} from '@chronobank/login/redux/network/constants'
import {
  navigateToSelectWallet,
  navigateToRecoverAccountPage,
} from '../../redux/navigation'
import {
  FORM_LOGIN_PAGE,
  FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE,
} from '../../redux/constants'
import {
  initLoginPage,
  onSubmitLoginForm,
  onSubmitLoginFormFail,
} from '../../redux/thunks'
import UserRow from '../UserRow/UserRow'

import styles from './styles'
import './LoginForm.scss'

function mapStateToProps (state) {
  const network = state.get(DUCK_NETWORK)
  const selectedWallet = state.get(DUCK_PERSIST_ACCOUNT).selectedWallet
  const formSelector = formValueSelector(FORM_LOGIN_PAGE)

  return {
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
    initLoginPage: () => dispatch(initLoginPage()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    navigateToRecoverAccountPage: () => dispatch(navigateToRecoverAccountPage()),
  }
}

class LoginForm extends React.Component {
  static propTypes = {
    initLoginPage: PropTypes.func,
    navigateToRecoverAccountPage: PropTypes.func,
    handleSubmit: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
    selectedWallet: PropTypes.object,
    successMessage: PropTypes.string,
    classes: PropTypes.any,
    error: PropTypes.string,
    submitting: PropTypes.bool,
  }

  componentWillMount () {
    this.props.initLoginPage()
  }

  renderSuccessMessage = () => {
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

  renderDefaultTypeForm = () => {
    const { classes, submitting, error, navigateToRecoverAccountPage } = this.props

    return (
      <div>
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
            label={<Translate value='LoginForm.submitButton' />}
            isLoading={submitting}
          />
          {
            error
              ? (<div styleName='form-error'>{error}</div>)
              : null
          }
          <button onClick={navigateToRecoverAccountPage} styleName='link'>
            <Translate value='LoginForm.forgotPassword' />
          </button>
        </div>
      </div>
    )
  }

  renderDeviceTypeForm = () => {
    const { error, submitting } = this.props

    return (
      <div styleName='actions'>
        <Button
          styleName='button'
          buttonType='login'
          type='submit'
          label={<Translate value='LoginForm.submitButton' />}
          isLoading={submitting}
        />
        {
          error
            ? (<div styleName='form-error'>{error}</div>)
            : null
        }
      </div>
    )
  }

  renderType = () => {
    const { selectedWallet } = this.props

    if (!selectedWallet || !selectedWallet.type) {
      return this.renderDefaultTypeForm()
    }

    switch (selectedWallet.type) {
      case WALLET_TYPE_MEMORY:
        return this.renderDefaultTypeForm()

      case WALLET_TYPE_LEDGER:
      case WALLET_TYPE_TREZOR:
      case WALLET_TYPE_METAMASK:
        return this.renderDeviceTypeForm()

      default:
        return this.renderDefaultTypeForm()
    }
  }

  render () {
    const {
      handleSubmit,
      navigateToSelectWallet,
      selectedWallet,
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
            avatar={getAccountAvatar(selectedWallet)}
            onClick={navigateToSelectWallet}
            linkTitle='My Accounts'
          />

          {
            this.renderType()
          }

        </div>
      </form>
    )
  }
}

const form = reduxForm({ form: FORM_LOGIN_PAGE })(LoginForm)
export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(form)
