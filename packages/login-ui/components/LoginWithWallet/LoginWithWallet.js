/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form/immutable'
import React, { Component } from 'react'
import { Link } from 'react-router'
import Button from 'components/common/ui/Button/Button'
import { Translate } from 'react-redux-i18n'
import FileIcon from 'assets/img/icons/file-white.svg'
import DeleteIcon from 'assets/img/icons/delete-white.svg'
import SpinnerGif from 'assets/img/spinningwheel.gif'
import CheckIcon from 'assets/img/icons/check-green.svg'
import spinner from 'assets/img/spinningwheel-1.gif'
import {
  FORM_WALLET_UPLOAD,
} from '../../redux/actions'
import './LoginWithWallet.scss'

class LoginWithWallet extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
  }

  constructor () {
    super()
    this.state = {
      wallet: null,
      isUploaded: false,
      isUploading: false,
      fileName: '',
    }
  }

  handleFileUploaded = (e) => {
    this.setState({
      isUploading: false,
      isUploaded: true,
      wallet: e.target.result,
    })
  }

  handleUploadFile = (e) => {
    const file = e.target.files[ 0 ]
    if (!file) {
      return
    }
    this.setState({
      isUploading: true,
      fileName: file.name,
    })
    const reader = new FileReader()
    reader.onload = this.handleFileUploaded
    reader.readAsText(file)
  }

  handleRemoveWallet = () => {
    this.setState({
      wallet: null,
      isUploaded: false,
      isUploading: false,
      fileName: '',
    })
    this.walletFileUploadInput.value = ''
  }

  async handleSubmitForm (values, dispatch){
    const { onSubmit } = this.props
    const { wallet } = this.state

    await onSubmit(wallet)
  }

  render () {
    const { handleSubmit, onSubmit, error } = this.props
    const { isUploading, isUploaded, fileName } = this.state

    return (
      <form styleName='wrapper' name={FORM_WALLET_UPLOAD} onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
        <div styleName='page-title'>
          <Translate value='LoginWithWallet.title' />
        </div>

        <p styleName='description'>
          <Translate value='LoginWithWallet.description' />
          <br />
          <Translate value='LoginWithWallet.descriptionExtra' />
        </p>

        <div styleName='row'>
          {!isUploaded && !isUploading && (
            <Button
              styleName='button buttonWallet'
              buttonType='login'
              onClick={() => this.walletFileUploadInput.click()}
            >
              <img styleName='before-img' src={FileIcon} alt='' />
              <span styleName='button-text'>
                <Translate value='LoginWithWallet.uploadWalletFile' />
              </span>
            </Button>
          )}

          {isUploading && (
            <Button styleName='button' buttonType='login' disabled>
              <img styleName='before-img' src={SpinnerGif} alt='' />
              <span styleName='button-text'>
                <Translate value='LoginWithWallet.uploading' />
              </span>
              <img styleName='after-img' src={DeleteIcon} alt='' />
            </Button>
          )}

          {isUploaded && (
            <div styleName='password-wrapper'>
              <Button styleName='button' buttonType='login' disabled>
                <img styleName='before-img' src={CheckIcon} alt='' />
                <span styleName='button-text'>{fileName}</span>
                <span
                  styleName='removeButton'
                  onClick={() => this.handleRemoveWallet()}
                >
                  <img styleName='after-img' src={DeleteIcon} alt='' />
                </span>
              </Button>
            </div>
          )}

          <input
            onChange={this.handleUploadFile}
            ref={(input) => this.walletFileUploadInput = input}
            type='file'
            styleName='hide'
          />

        </div>

        <div styleName='actions'>
          <Button
            styleName='submit'
            buttonType='login'
            type='submit'
            disabled={!isUploaded}
            label={isUploading ? (
              <span styleName='spinner-wrapper'>
                <img
                  src={spinner}
                  alt=''
                  width={24}
                  height={24}
                />
              </span> ) :
              <Translate value='LoginWithWallet.login' />
            }
          />
          { error ? <div styleName='error'>{error}</div> : null }
          <Translate value='LoginWithWallet.or' />
          <br />
          <Link to='/login' href styleName='link'>
            <Translate value='LoginWithWallet.back' />
          </Link>
        </div>

      </form>
    )
  }
}

export default reduxForm({ form: FORM_WALLET_UPLOAD })(LoginWithWallet)
