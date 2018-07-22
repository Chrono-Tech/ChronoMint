/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { MuiThemeProvider } from '@material-ui/core'
import { Field, reduxForm } from 'redux-form/immutable'
import React, { Component } from 'react'
import { Link } from 'react-router'
import Button from 'components/common/ui/Button/Button'
import {
  FORM_CONFIRM_MNEMONIC,
  initConfirmMnemonicPage,
  navigateToConfirmMnemonicPage,
  onSubmitConfirmMnemonic,
  onSubmitConfirmMnemonicFail,
  onSubmitConfirmMnemonicSuccess,
} from '@chronobank/login/redux/network/actions'

import './ConfirmMnemonic.scss'

function mapStateToProps (state) {

  return {
    mnemonic: state.get('network').newAccountMnemonic,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    navigateToConfirmPage: () => dispatch(navigateToConfirmMnemonicPage()),
    initConfirmMnemonicPage: () => dispatch(initConfirmMnemonicPage()),
    onSubmit: (values) => {
      const confirmMnemonic = values.get('mnemonic')

      dispatch(onSubmitConfirmMnemonic(confirmMnemonic))
    },
    onSubmitSuccess: () => dispatch(onSubmitConfirmMnemonicSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitConfirmMnemonicFail(errors, dispatch, submitErrors)),
  }
}

class ConfirmMnemonicPage extends Component {
  static propTypes = {
    mnemonic: PropTypes.string,
    initConfirmMnemonicPage: PropTypes.func,
  }

  static defaultProps = {
    mnemonic: '',
  }

  constructor (props){
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

  componentDidMount(){
    this.props.initConfirmMnemonicPage()
  }

  getCurrentMnemonic (){
    return this.state.confirmPhrase.map((item) => item.word).join(' ')
  }

  getWordsButtons (){
    return this.state.currentWordsArray.map((item, index) => {
      const wordSelected = this.state.confirmPhrase.includes(item)

      return (
        <Button
          key={index}
          onClick={this.onClickWord.bind(this, item)}
          styleName={classnames('word')}
          disabled={wordSelected}
        >
          { item.word }
        </Button>
      )}
    )
  }

  onClickWord (word, e){
    const { dispatch, change } = this.props

    if (!this.state.confirmPhrase.includes(word)) {
      this.setState(
        { confirmPhrase: this.state.confirmPhrase.concat(word) },
        () => change('mnemonic', this.getCurrentMnemonic())
      )
    }
  }

  clearMnemonic (){
    const { dispatch, change } = this.props

    this.setState(
      { confirmPhrase: [] },
      () => change('mnemonic', this.getCurrentMnemonic())
    )
  }

  clearLastWord (){
    const { dispatch, change } = this.props

    this.setState(
      { confirmPhrase: this.state.confirmPhrase.slice(0, -1) },
      () => change('mnemonic', this.getCurrentMnemonic())
    )
  }

  render () {
    const { handleSubmit, error } = this.props
    return (
      <MuiThemeProvider>
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

              <Link to='/login/mnemonic' href styleName='link'>
                <Translate value='ConfirmMnemonic.back' />
              </Link>
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

const form = reduxForm({ form: FORM_CONFIRM_MNEMONIC })(ConfirmMnemonicPage)
export default connect(mapStateToProps, mapDispatchToProps)(form)
