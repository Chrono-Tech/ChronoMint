/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import { stopSubmit, SubmissionError } from 'redux-form'
import {
  navigateBack,
} from '../../redux/actions'
import {
  FORM_PRIVATE_KEY_LOGIN_PAGE,
} from '../../redux/constants'
import LoginWithPrivateKey from './LoginWithPrivateKey'

const mapDispatchToProps = (dispatch) => {
  return {
    navigateBack: () => dispatch(navigateBack()),
  }
}

class LoginWithPrivateKeyContainer extends PureComponent {
  static propTypes = {
    navigateBack: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
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
      privateKey,
    }
  }

  handleSubmitSuccess (result) {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
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
        previousPage={this.props.navigateBack}
      />
    )
  }
}

export default connect(null, mapDispatchToProps)(LoginWithPrivateKeyContainer)
