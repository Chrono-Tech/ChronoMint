/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { stopSubmit, SubmissionError } from 'redux-form/immutable'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  initRecoverAccountPage,
} from '@chronobank/login/redux/network/thunks'
import {
  FORM_RECOVER_ACCOUNT,
  navigateToSelectWallet,
} from '../../redux/actions'
import {
  onSubmitRecoverAccountForm,
  onSubmitRecoverAccountFormSuccess,
  onSubmitRecoverAccountFormFail,
} from '../../redux/thunks'
import * as PersistAccountActions from "../../../core/redux/persistAccount/actions";

function mapStateToProps (state) {
  const selectedWallet = state.get('persistAccount').selectedWallet
  return {
    selectedWallet: selectedWallet && new AccountEntryModel(selectedWallet),
  }
}

function mapDispatchToProps (dispatch,) {
  return {
    onSubmitSuccess: () => dispatch(onSubmitRecoverAccountFormSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitRecoverAccountFormFail(errors, submitErrors)),
    initRecoverAccountPage: () => dispatch(initRecoverAccountPage()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
  }
}

class RecoverAccountContainer extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(AccountEntryModel),
    initRecoverAccountPage: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
  }

  async handleSubmit (values) {
    let words = [], mnemonic = ''

    for (let i = 1; i <= 12; i++) {
      const word = values.get(`word-${i}`)
      word && words.push(word.trim())
    }

    mnemonic = words.join(' ')

    // const validForm = await dispatch(PersistAccountActions.validateMnemonicForAccount(mnemonic))
    const validForm = true

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
    const { handleSubmit, selectedWallet, navigateToSelectWallet, error } = this.props

    const wordsArray = new Array(12).fill()

    return (
      <RecoverAccount />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecoverAccountContainer)
