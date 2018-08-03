/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Translate } from 'react-redux-i18n'
import { Field, reduxForm } from 'redux-form/immutable'
import React, { Component } from 'react'
import Button from 'components/common/ui/Button/Button'
import {
  FORM_CONFIRM_MNEMONIC,
} from '@chronobank/login-ui/redux/constants'

import './ConfirmMnemonic.scss'

class ConfirmMnemonic extends Component {
  static propTypes = {
    mnemonic: PropTypes.string,
    previousPage: PropTypes.func,
  }

  static defaultProps = {
    mnemonic: '',
  }

  constructor (props) {
    super(props)

    const wordsArray = props.mnemonic ?
      props.mnemonic.split(' ').map((word, index) => {
        return { index, word }
      }) : []

    this.state = {
      confirmPhrase: [],
      currentWordsArray: wordsArray.sort((a,b) => a.word < b.word),
    }
  }

  getCurrentMnemonic () {
    return this.state.confirmPhrase.map((item) => item.word).join(' ')
  }

  getWordsButtons () {
    return this.state.currentWordsArray.map((item, index) => {
      const wordSelected = this.state.confirmPhrase.includes(item)

      return (
        <Button
          key={index}
          onClick={this.onClickWord.bind(this, item)}
          styleName='word'
          disabled={wordSelected}
        >
          { item.word }
        </Button>
      )}
    )
  }

  onClickWord (word) {
    const { change } = this.props

    if (!this.state.confirmPhrase.includes(word)) {
      this.setState(
        { confirmPhrase: this.state.confirmPhrase.concat(word) },
        () => change('mnemonic', this.getCurrentMnemonic())
      )
    }
  }

  clearMnemonic () {
    const { change } = this.props

    this.setState(
      { confirmPhrase: [] },
      () => change('mnemonic', this.getCurrentMnemonic())
    )
  }

  clearLastWord () {
    const { dispatch, change } = this.props

    this.setState(
      { confirmPhrase: this.state.confirmPhrase.slice(0, -1) },
      () => change('mnemonic', this.getCurrentMnemonic())
    )
  }

  render () {
    const { handleSubmit, error, previousPage } = this.props

    return (
      <form styleName='form' name={FORM_CONFIRM_MNEMONIC} onSubmit={handleSubmit}>
        <div>
          <div styleName='page-title'>
            <Translate value='ConfirmMnemonic.title' />
          </div>

          <p styleName='description'>
            <Translate value='ConfirmMnemonic.description' />
          </p>

          <div styleName='passPhraseWrapper'>
            <div styleName='passPhrase'>{ this.getCurrentMnemonic() }</div>
            <Field
              component='input'
              type='hidden'
              name='mnemonic'
              readOnly
            />

          </div>

          <div styleName={classnames({ error: true,  visible: error })}>
            {error}
          </div>

          <div styleName='wordsBlock'>
            { this.getWordsButtons() }
          </div>

          <div styleName='controlsBlock'>
            <div styleName='control' onClick={this.clearMnemonic.bind(this)}>
              <Translate value='ConfirmMnemonic.startOver' />
            </div>
            <div styleName='control' onClick={this.clearLastWord.bind(this)}>
              <Translate value='ConfirmMnemonic.undo' />
            </div>
          </div>

          <div styleName='actions'>
            <Button styleName='submit' type='submit' buttonType='login'>
              <Translate value='ConfirmMnemonic.done' />
            </Button>

            <button onClick={previousPage} styleName='link'>
              <Translate value='ConfirmMnemonic.back' />
            </button>
          </div>

          <div styleName='progressBlock'>
            <div styleName='progressPoint' />
            <div styleName='progressPoint' />
            <div styleName='progressPoint progressPointInactive' />
          </div>
        </div>
      </form>
    )
  }
}

export default reduxForm({ form: FORM_CONFIRM_MNEMONIC })(ConfirmMnemonic)
