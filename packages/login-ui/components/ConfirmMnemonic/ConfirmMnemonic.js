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
import MnemonicButton from './MnemonicButton'

import './ConfirmMnemonic.scss'

class ConfirmMnemonic extends Component {
  static propTypes = {
    confirmPhrase: PropTypes.arrayOf(PropTypes.string),
    currentWordsArray: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    onClearLastWord: PropTypes.func,
    onClearMnemonic: PropTypes.func,
    onClickWord: PropTypes.func,
    previousPage: PropTypes.func,
  }

  getWordsButtons = () =>
    this.props.currentWordsArray
      .map((item) => {
        const wordSelected = this.props.confirmPhrase.includes(item.word)
        const keyIndex = `${item.word}${item.index}`
        return (
          <MnemonicButton
            key={keyIndex}
            isWordSelected={wordSelected}
            mnemonicWord={item.word}
            onClick={this.props.onClickWord}
          />
        )
      })

  getCurrentMnemonic = () =>
    this.props.confirmPhrase.join(' ')

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
            <div styleName='passPhrase'>
              {
                this.getCurrentMnemonic()
              }
            </div>
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
            <div styleName='control' onClick={this.props.onClearMnemonic}>
              <Translate value='ConfirmMnemonic.startOver' />
            </div>
            <div styleName='control' onClick={this.props.onClearLastWord}>
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
