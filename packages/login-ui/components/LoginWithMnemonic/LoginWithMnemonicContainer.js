/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import bip39 from 'bip39'
import { stopSubmit, SubmissionError } from 'redux-form'
import {
  FORM_MNEMONIC_LOGIN_PAGE,
} from '../../redux/constants'
import LoginWithMnemonic from './LoginWithMnemonic'

export default class LoginWithMnemonicContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
  }

  handleSubmit = async (values) => {
    const { onSubmit } = this.props
    const mnemonic = values.get('mnemonic')
    const mnemonicValue = (mnemonic || '').trim()

    if (!bip39.validateMnemonic(mnemonicValue)) {
      throw new SubmissionError({ mnemonic: 'Invalid mnemonic' })
    }

    return onSubmit({ mnemonic })
  }

  handleSubmitSuccess = (result) =>  {
    const { onSubmitSuccess } = this.props
    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail = (errors, dispatch, submitErrors) => {
    dispatch(stopSubmit(FORM_MNEMONIC_LOGIN_PAGE, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <LoginWithMnemonic
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
        onSubmitFail={this.handleSubmitFail}
        previousPage={this.props.previousPage}
      />
    )
  }
}
