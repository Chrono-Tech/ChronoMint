/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { stopSubmit, SubmissionError } from 'redux-form/immutable'
import React, { Component } from 'react'
import {
  FORM_CONFIRM_MNEMONIC,
} from '@chronobank/login-ui/redux/constants'

import ConfirmMnemonic from './ConfirmMnemonic'

export default class ConfirmMnemonicContainer extends Component {
  static propTypes = {
    mnemonic: PropTypes.string,
    previousPage: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
  }

  static defaultProps = {
    mnemonic: '',
  }

  handleSubmit (values) {
    const { onSubmit, mnemonic } = this.props

    const formMnemonic = values.get('mnemonic')

    if (formMnemonic !== mnemonic) {
      throw new SubmissionError({ _error: 'Invalid mnemonic' })
    }

    onSubmit && onSubmit()
  }

  handleSubmitSuccess (result) {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail (errors, dispatch, submitErrors) {
    dispatch(stopSubmit(FORM_CONFIRM_MNEMONIC, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <ConfirmMnemonic
        mnemonic={this.props.mnemonic}
        onSubmit={this.handleSubmit.bind(this)}
        onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
        onSubmitFail={this.handleSubmitFail.bind(this)}
        previousPage={this.props.previousPage}
      />
    )
  }
}

