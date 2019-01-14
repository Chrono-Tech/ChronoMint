/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { stopSubmit } from 'redux-form/immutable'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  FORM_RESET_PASSWORD,
} from '../../redux/constants'
import ResetPassword from './ResetPassword'

export default class ResetPasswordContainer extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(AccountEntryModel),
    onSubmitSuccess: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  handleSubmit = async (values) => {
    const { onSubmit } = this.props
    const password = values.get('password')

    onSubmit && await onSubmit({ password })
  }

  handleSubmitSuccess = (result) => {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail = (errors, dispatch, submitErrors) => {
    dispatch(stopSubmit(FORM_RESET_PASSWORD, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <ResetPassword
        selectedWallet={this.props.selectedWallet}
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
        onSubmitFail={this.handleSubmitFail}
      />
    )
  }
}
