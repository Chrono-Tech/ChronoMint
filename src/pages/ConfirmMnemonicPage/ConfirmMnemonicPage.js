/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import classnames from 'classnames'
import { MuiThemeProvider } from 'material-ui'
import { reduxForm, Field } from 'redux-form/immutable'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button } from 'components'

import './ConfirmMnemonicPage.scss'

const FORM_CONFIRM_MNEMONIC = 'ConfirmMnemonicForm'

@reduxForm({ form: FORM_CONFIRM_MNEMONIC })
export default class ConfirmMnemonicPage extends Component {
  static propTypes = {
    mnemonic: PropTypes.string,
  }

  static defaultProps = {
    mnemonic: 'together minute slide illegal mandate recycle claw like real above idea north',
  }

  constructor (props){
    super(props)

    const wordsArray = props.mnemonic.split(' ').map((word, index) => {
      return { index, word }
    })


    this.state = {
      confirmPhrase: [],
      currentWordsArray: wordsArray.sort((a,b) => a.word < b.word),
    }
  }

  getCurrentMnemonic (){
    return this.state.confirmPhrase.map((item) => item.word).join(' ')
  }

  getWordsButtons (){
    return this.state.currentWordsArray.map((item, index) => {
      const wordSelected = this.state.confirmPhrase.includes(item)

      return (
        <div
          key={index}
          onClick={this.onClickWord.bind(this, item)}
          styleName={classnames('word', wordSelected ? 'wordInactive' : '')}
        >
          { item.word }
        </div>
      )}
    )
  }

  onClickWord (word, e){
    const { dispatch, change } = this.props

    if (!this.state.confirmPhrase.includes(word)) {
      this.setState(
        { confirmPhrase: this.state.confirmPhrase.concat(word) },
        () => dispatch(change('mnemonic', this.getCurrentMnemonic()))
      )
    }
  }

  clearMnemonic (){
    const { dispatch, change } = this.props

    this.setState(
      { confirmPhrase: [] },
      () => dispatch(change('mnemonic', this.getCurrentMnemonic()))
    )
  }

  clearLastWord (){
    const { dispatch, change } = this.props

    this.setState(
      { confirmPhrase: this.state.confirmPhrase.slice(0, -1) },
      () => dispatch(change('mnemonic', this.getCurrentMnemonic()))
    )
  }

  render () {
    const { handleSubmit } = this.props

    return (
      <MuiThemeProvider>
        <form styleName='form' name={FORM_CONFIRM_MNEMONIC} onSubmit={handleSubmit}>
          <div>
            <div styleName='page-title'>Confirm back-up phrase</div>

            <p styleName='description'>Click on back-up phrase words in the correct order.</p>

            <div styleName='passPhraseWrapper'>
              <div styleName='passPhrase'>{ this.getCurrentMnemonic() }</div>
              <Field
                styleName='passPhrase'
                component='input'
                type='hidden'
                name='mnemonic'
                readOnly
              />

            </div>

            <div styleName='wordsBlock'>
              { this.getWordsButtons() }
            </div>

            <div styleName='controlsBlock'>
              <div styleName='control' onClick={this.clearMnemonic.bind(this)}>Start Over</div>
              <div styleName='control' onClick={this.clearLastWord.bind(this)}>Undo</div>
            </div>

            <div styleName='actions'>
              <Button styleName='submit' buttonType='login'>
                Done
              </Button>

              <Link to='/' href styleName='link'>Back</Link>
            </div>

            <div styleName='progressBlock'>
              <div styleName='progressPoint' />
              <div styleName='progressPoint' />
              <div styleName='progressPoint progressPointInactive' />
            </div>
          </div>
        </form>
      </MuiThemeProvider>
    )
  }
}
