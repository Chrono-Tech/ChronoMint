/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { stopSubmit, SubmissionError } from 'redux-form/immutable'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  initRecoverAccountPage,
} from '@chronobank/login/redux/network/thunks'
import {
  FORM_RESET_PASSWORD,
  navigateToSelectWallet,
} from '../../redux/actions'
import {
  onSubmitRecoverAccountForm,
  onSubmitRecoverAccountFormSuccess,
  onSubmitRecoverAccountFormFail,
} from '../../redux/thunks'
import * as PersistAccountActions from "../../../core/redux/persistAccount/actions";
import ResetPassword from './ResetPassword'

function mapStateToProps (state) {
  const selectedWallet = state.get('persistAccount').selectedWallet
  return {
    selectedWallet: selectedWallet && new AccountEntryModel(selectedWallet),
  }
}

function mapDispatchToProps (dispatch,) {
  return {
    onSubmitSuccess: () => dispatch(onSubmitRecoverAccountFormSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitRecoverAccountFormFail(errors, submitErrors)),
    initRecoverAccountPage: () => dispatch(initRecoverAccountPage()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
  }
}

class ResetPasswordContainer extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(AccountEntryModel),
    initRecoverAccountPage: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
  }

  async handleSubmit (values) {
    let password = values.get('password')

    return {
      password,
    }
  }

  handleSubmitSuccess (result) {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail (errors, dispatch, submitErrors) {
    dispatch(stopSubmit(FORM_RESET_PASSWORD, submitErrors && submitErrors.errors))
  }

  render () {
    const { handleSubmit, selectedWallet, navigateToSelectWallet, error } = this.props


    return (
      <ResetPassword />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordContainer)
