/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import classnames from 'classnames'
import { TextField } from 'redux-form-material-ui'
import { reduxForm, Field } from 'redux-form/immutable'
import React, { Component } from 'react'
import { Link } from 'react-router'
import Button from 'components/common/ui/Button/Button'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import {
  onSubmitWalletUpload,
  onSubmitWalletUploadFail,
  clearErrors,
  loading,
  initLoginWithWallet,
  FORM_WALLET_UPLOAD,
} from '@chronobank/login/redux/network/actions'

import FileIcon from 'assets/img/icons/file-white.svg'
import DeleteIcon from 'assets/img/icons/delete-white.svg'
import SpinnerGif from 'assets/img/spinningwheel.gif'
import WarningIcon from 'assets/img/icons/warning.svg'
import CheckIcon from 'assets/img/icons/check-green.svg'
import spinner from 'assets/img/spinningwheel-1.gif'

import styles from 'layouts/Splash/styles'
import './LoginWithWallet.scss'

const mapStateToProps = (state) => ({
  isLoading: state.get('network').isLoading,
})

const mapDispatchToProps = (dispatch) => {
  return {
    clearErrors: () => dispatch(clearErrors()),
    loading: (isLoading) => dispatch(loading(isLoading)),
    onSubmit: async (values, dispatch, walletString) => {
      const password = values.get('password')

      await dispatch(onSubmitWalletUpload(walletString, password))
    },
    initLoginWithWallet: () => dispatch(initLoginWithWallet()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitWalletUploadFail(errors, dispatch, submitErrors)),
  }
}

class LoginWithWallet extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    clearErrors: PropTypes.func,
    loading: PropTypes.func,
    initLoginWithWallet: PropTypes.func,
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

  componentWillMount(){
    this.props.initLoginWithWallet()
  }

  handleFileUploaded = (e) => {
    this.props.clearErrors()
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
    this.props.clearErrors()
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

  async handleSubmitForm(values, dispatch, t,b,c){
    const { onSubmit } = this.props
    const { wallet } = this.state

    await onSubmit(values, dispatch, wallet)
  }

  render () {
    const { isLoading, handleSubmit, onSubmit, error } = this.props
    const { isUploading, isUploaded, fileName } = this.state

    return (
        <form styleName='wrapper' name={FORM_WALLET_UPLOAD} onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
          <div styleName='page-title'>
            <Translate value='LoginWithWallet.title' />
          </div>

          <p styleName='description'>
            <Translate value='LoginWithWallet.description' />
            <Translate value='LoginWithWallet.descriptionExtra' />
          </p>

          <div styleName='row'>
            {!isUploaded && !isUploading && (
              <Button
                styleName='button'
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
              disabled={isLoading || !isUploaded}
              label={isLoading ? <span styleName='spinner-wrapper'>
                <img
                  src={spinner}
                  alt=''
                  width={24}
                  height={24}
                />
              </span> : <Translate value='LoginWithWallet.login' />}
            />
            { error ? <div styleName='error'>{error}</div> : null }
            <Translate value='LoginWithWallet.or' />&nbsp;
            <Link to='/login' href styleName='link'>
              <Translate value='LoginWithWallet.back' />
            </Link>
          </div>

        </form>
    )
  }
}

const form = reduxForm({ form: FORM_WALLET_UPLOAD })(LoginWithWallet)
export default connect(mapStateToProps, mapDispatchToProps)(form)
