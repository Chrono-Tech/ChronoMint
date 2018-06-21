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
import { UserRow, Button } from 'components'

import FileIcon from 'assets/img/icons/file-white.svg'
import DeleteIcon from 'assets/img/icons/delete-white.svg'
import SpinnerGif from 'assets/img/spinningwheel.gif'
import WarningIcon from 'assets/img/icons/warning.svg'
import CheckIcon from 'assets/img/icons/check-green.svg'

import './UploadWalletPage.scss'

export default class MnemonicPage extends Component {
  static propTypes = {
    mnemonic: PropTypes.string,
  }

  static defaultProps = {
    mnemonic: '',
  }

  render () {
    return (
      <MuiThemeProvider>
        <div styleName='wrapper'>
          <div>
            <div styleName='page-title'>Upload a Wallet File</div>

            <p styleName='description'>
              Upload a wallet file to add the login information to your browser.
              We provide the file on New Account Creation.
            </p>

            <div styleName='row'>
              <Button styleName='button' buttonType='login'>
                <img styleName='before-img' src={FileIcon} alt='' />
                <span styleName='button-text'>Browse for a Wallet File</span>
              </Button>

              <Button styleName='button' buttonType='login' disabled>
                <img styleName='before-img' src={SpinnerGif} alt='' />
                <span styleName='button-text'>Uploading</span>
                <img styleName='after-img' src={DeleteIcon} alt='' />
              </Button>

              <Button styleName='button' buttonType='login' disabled>
                <img styleName='before-img' src={CheckIcon} alt='' />
                <span styleName='button-text'>Uploading</span>
                <img styleName='after-img' src={DeleteIcon} alt='' />
              </Button>

              <Button styleName='button button-warning' buttonType='login' disabled>
                <img styleName='before-img' src={WarningIcon} alt='' />
                <span styleName='button-text'>Upload Error</span>
                <img styleName='after-img' src={FileIcon} alt='' />
              </Button>
            </div>

            <div styleName='actions'>
              <Button styleName='submit' buttonType='login' disabled>
                Proceed to login
              </Button>
              or
              <br />
              <Link to='/login' href styleName='link'>Back</Link>
            </div>

          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
