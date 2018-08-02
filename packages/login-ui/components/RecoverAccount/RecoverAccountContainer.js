/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { stopSubmit, SubmissionError } from 'redux-form/immutable'
import { validateMnemonicForAccount } from '@chronobank/core/redux/persistAccount/utils'
import {
  FORM_RECOVER_ACCOUNT,
} from '../../redux/actions'
import RecoverAccount from './RecoverAccount'

export default class RecoverAccountContainer extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.object,
    navigateToSelectWallet: PropTypes.func,
    validateMnemonicForAccount: PropTypes.func,
  }

  async handleSubmit (values) {
    const { selectedWallet } = this.props

    let words = [], mnemonic = ''

    for (let i = 1; i <= 12; i++) {
      const word = values.get(`word-${i}`)
      word && words.push(word.trim())
    }

    mnemonic = words.join(' ')

    const validForm = validateMnemonicForAccount(mnemonic, selectedWallet)

    if (!validForm) {
      throw new SubmissionError({ _error: 'Mnemonic incorrect for this wallet' })
    }

    return {
      mnemonic,
    }
  }

  handleSubmitSuccess (result) {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail (errors, dispatch, submitErrors) {
    dispatch(stopSubmit(FORM_RECOVER_ACCOUNT, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <RecoverAccount
        navigateToSelectWallet={this.props.navigateToSelectWallet}
        selectedWallet={this.props.selectedWallet}
        onSubmit={this.handleSubmit.bind(this)}
        onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
        onSubmitFail={this.handleSubmitFail.bind(this)}
      />
    )
  }
}
