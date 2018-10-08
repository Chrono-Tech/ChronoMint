/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { stopSubmit } from 'redux-form'
import { FORM_PRIVATE_KEY_LOGIN_PAGE } from '../../redux/constants'
import LoginWithPrivateKey from './LoginWithPrivateKey'

export default class LoginWithPrivateKeyContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
  }

  handleSubmit = async (values) => {
    const { onSubmit } = this.props

    let privateKey = values.get('pk')
    privateKey = (privateKey || '').trim()

    // TODO: Rework and enable private Key validation
    // Validator must be located somewhere in utils.js (pure js)
    // if (!privateKeyProvider.validatePrivateKey(privateKey)) {
    //   throw new SubmissionError({ pk: 'Wrong private key' })
    // }

    if (privateKey.slice(0, 2) === '0x') {
      privateKey = privateKey.slice(2)
    }

    await onSubmit({ privateKey })
  }

  handleSubmitSuccess = (result) => {
    const { onSubmitSuccess } = this.props
    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail = (errors, dispatch, submitErrors) => {
    dispatch(stopSubmit(FORM_PRIVATE_KEY_LOGIN_PAGE, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <LoginWithPrivateKey
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
        onSubmitFail={this.handleSubmitFail}
        previousPage={this.props.previousPage}
      />
    )
  }
}
