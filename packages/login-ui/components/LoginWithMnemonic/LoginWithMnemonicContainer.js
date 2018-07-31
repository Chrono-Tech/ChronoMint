/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import { stopSubmit, SubmissionError } from 'redux-form'
import {
  FORM_MNEMONIC_LOGIN_PAGE,
} from '../../redux/actions'
import LoginWithMnemonic from './LoginWithMnemonic'

export default class LoginWithMnemonicContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func.isRequired,
    onSubmitSuccess: PropTypes.func.isRequired,
  }

  handleSubmit (values) {
    const mnemonic = values.get('mnemonic')

    let mnemonicValue = (mnemonic || '').trim()

    if (!mnemonicProvider.validateMnemonic(mnemonicValue)) {
      throw new SubmissionError({ mnemonic: 'Invalid mnemonic' })
    }

    return {
      mnemonic,
    }
  }

  handleSubmitSuccess (result) {
    this.props.onSubmitSuccess(result)
  }

  handleSubmitFail (errors, dispatch, submitErrors) {
    dispatch(stopSubmit(FORM_MNEMONIC_LOGIN_PAGE, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <LoginWithMnemonic
        onSubmit={this.handleSubmit.bind(this)}
        onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
        onSubmitFail={this.handleSubmitFail.bind(this)}
        previousPage={this.props.previousPage}
      />
    )
  }
}
