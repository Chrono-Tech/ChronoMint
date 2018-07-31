/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import { stopSubmit, SubmissionError } from 'redux-form'
import {
  FORM_PRIVATE_KEY_LOGIN_PAGE,
} from '../../redux/actions'
import LoginWithPrivateKey from './LoginWithPrivateKey'

export default class LoginWithPrivateKeyContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func.isRequired,
    onSubmitSuccess: PropTypes.func.isRequired,
  }

  handleSubmit (values) {
    let privateKey = values.get('pk')

    privateKey = (privateKey || '').trim()

    if (!privateKeyProvider.validatePrivateKey(privateKey)) {
      throw new SubmissionError({ pk: 'Wrong private key' })
    }

    if (privateKey.slice(0, 2) === '0x') {
      privateKey = privateKey.slice(2)
    }

    return {
      privateKey: pk,
    }
  }

  handleSubmitSuccess (result) {
    this.props.onSubmitSuccess(result)
  }

  handleSubmitFail (errors, dispatch, submitErrors) {
    dispatch(stopSubmit(FORM_PRIVATE_KEY_LOGIN_PAGE, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <LoginWithPrivateKey
        onSubmit={this.handleSubmit.bind(this)}
        onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
        onSubmitFail={this.handleSubmitFail.bind(this)}
        previousPage={this.props.previousPage}
      />
    )
  }
}
