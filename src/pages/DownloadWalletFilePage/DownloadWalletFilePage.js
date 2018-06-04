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

import WalletIcon from 'assets/img/icons/wallet-white.svg'

import './DownloadWalletFilePage.scss'

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
            <div styleName='page-title'>Download a Wallet File</div>

            <p styleName='description'>
              You can use this wallet file in password recovery option to
              make your account available in another browser, for example.
              The file is protected by the same password as your created before.
            </p>

            <div styleName='row'>
              <Button styleName='button' type='button'>
                <img styleName='wallet-img' src={WalletIcon} alt='' />
                Download
              </Button>
            </div>

            <div styleName='actions'>
              <Button styleName='submit' buttonType='login'>
                Finish
              </Button>
            </div>

            <div styleName='progress-block'>
              <div styleName='progress-point' />
              <div styleName='progress-point' />
              <div styleName='progress-point' />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
