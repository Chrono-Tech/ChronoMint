/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { stopSubmit } from 'redux-form/immutable'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  initRecoverAccountPage,
} from '@chronobank/login/redux/network/thunks'
import {
  navigateToSelectWallet,
} from '../../redux/actions'
import {
  FORM_RESET_PASSWORD,
} from '../../redux/constants'
import ResetPassword from './ResetPassword'

function mapDispatchToProps (dispatch,) {
  return {
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
    const { onSubmit } = this.props
    let password = values.get('password')

    onSubmit && await onSubmit({ password })
  }

  handleSubmitSuccess (result) {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail (errors, dispatch, submitErrors) {
    dispatch(stopSubmit(FORM_RESET_PASSWORD, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <ResetPassword
        selectedWallet={this.props.selectedWallet}
        onSubmit={this.handleSubmit.bind(this)}
        onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
      />
    )
  }
}

export default connect(null, mapDispatchToProps)(ResetPasswordContainer)
