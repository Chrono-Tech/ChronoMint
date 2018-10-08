/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { stopSubmit } from 'redux-form'
import {
  FORM_WALLET_UPLOAD,
} from '../../redux/constants'
import LoginWithWallet from './LoginWithWallet'

export default class LoginWithWalletContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
  }

  handleSubmit = (walletString) => {
    const { onSubmit } = this.props

    return onSubmit && onSubmit(walletString)
  }

  handleSubmitSuccess = (result) => {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail = (errors, dispatch, submitErrors) => {
    dispatch(stopSubmit(FORM_WALLET_UPLOAD, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <LoginWithWallet
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
        onSubmitFail={this.handleSubmitFail}
        previousPage={this.props.previousPage}
      />
    )
  }
}
