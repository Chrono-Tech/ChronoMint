/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { stopSubmit, SubmissionError } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { change } from 'redux-form'
import React, { Component } from 'react'
import {
  FORM_CONFIRM_MNEMONIC,
} from '@chronobank/login-ui/redux/constants'

import ConfirmMnemonic from './ConfirmMnemonic'

function mapDispatchToProps (dispatch) {
  return {
    change: (key, value) => dispatch(change(FORM_CONFIRM_MNEMONIC, key, value)),
  }
}

@connect(null, mapDispatchToProps)
export default class ConfirmMnemonicContainer extends Component {
  static propTypes = {
    mnemonic: PropTypes.string,
    previousPage: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    change: PropTypes.func,
  }

  static defaultProps = {
    mnemonic: '',
  }

  constructor (props) {
    super(props)

    const wordsArray = props.mnemonic
      ? props.mnemonic.split(' ')
        .map((word, index) => ({ index, word }))
        .sort((a,b) => a.word < b.word)
      : []

    this.state = {
      confirmPhrase: [],
      currentWordsArray: wordsArray,
    }
  }

  handleClickWord = (wordItem) => {
    this.setState(
      { confirmPhrase: this.state.confirmPhrase.concat(wordItem) },
      this.refreshConfirmMnemonicForm
    )
  }

  handleSubmit = (values) => {
    const { onSubmit, mnemonic } = this.props

    const formMnemonic = values.get('mnemonic')

    if (formMnemonic !== mnemonic) {
      throw new SubmissionError({ _error: 'Invalid mnemonic' })
    }

    onSubmit && onSubmit()
  }

  handleSubmitSuccess = (result) => {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail = (errors, dispatch, submitErrors) => {
    dispatch(stopSubmit(FORM_CONFIRM_MNEMONIC, submitErrors && submitErrors.errors))
  }

  handleClearMnemonic = () => {
    this.setState(
      { confirmPhrase: [] },
      this.refreshConfirmMnemonicForm
    )
  }

  handleClearLastWord = () => {
    this.setState(
      { confirmPhrase: this.state.confirmPhrase.slice(0, -1) },
      this.refreshConfirmMnemonicForm
    )
  }

  isWordAlreadyUsed = (wordItem) => {
    return this.state.confirmPhrase
      .findIndex((item) => item.index === wordItem.index) !== -1 // Not found by index equals to "word is not used yet"
  }

  refreshConfirmMnemonicForm = () => {
    const confirmation = this.state.confirmPhrase
      .map((item) => item.word)
      .join(' ')
    this.props.change('mnemonic', confirmation)
  }

  render () {
    return (
      <ConfirmMnemonic
        isWordAlreadyUsed={this.isWordAlreadyUsed}
        confirmPhrase={this.state.confirmPhrase}
        currentWordsArray={this.state.currentWordsArray}
        onClearLastWord={this.handleClearLastWord}
        onClearMnemonic={this.handleClearMnemonic}
        onClickWord={this.handleClickWord}
        onSubmit={this.handleSubmit}
        onSubmitFail={this.handleSubmitFail}
        onSubmitSuccess={this.handleSubmitSuccess}
        previousPage={this.props.previousPage}
      />
    )
  }
}

