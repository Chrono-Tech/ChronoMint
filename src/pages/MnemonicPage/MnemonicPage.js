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

import PrintIcon from 'assets/img/icons/print-white.svg'

import './MnemonicPage.scss'

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
            <div styleName='page-title'>Write down back-up phrase</div>

            <p styleName='description'>
              You can use this phrase to login and access your wallet,
              even if you forgot your password. You may also print the key
              which will be provided with a QR code. Use this QR code to
              scan on phone on ChronoWallet recover page.
            </p>

            <div styleName='passPhraseWrapper'>
              <div styleName='passPhrase'>{ this.props.mnemonic }</div>
              <div styleName='printButtonWrapper'>
                <div styleName='printButton' onClick={() => {}}>
                  <img src={PrintIcon} alt='' />
                </div>
              </div>
            </div>

            <div styleName='infoBlock'>
              <div styleName='infoBlockHeader'>Important! Read the security guidelines</div>

              <ol styleName='infoBlockList'>
                <li>
                  <p styleName='listItemContent'>
                    <b>Don&apos;t share your back-up phrase (mnemonic key) with someone you don&apos;t trust.</b>
                    &nbsp;Double check services you&apos;re giving your mnemonic to and don&apos;t share your phrase with anyone.
                  </p>
                </li>

                <li>
                  <p styleName='listItemContent'>
                    <b>Don&apos;t loose your back-up phrase (mnemonic key).</b>
                    &nbsp;We do not store this information and Your account will be lost
                    together with all your funds and history.
                  </p>
                </li>
              </ol>
            </div>

            <div styleName='actions'>
              <Button styleName='submit' buttonType='login'>
                Proceed
              </Button>
            </div>

            <div styleName='progressBlock'>
              <div styleName='progressPoint' />
              <div styleName='progressPoint' />
              <div styleName='progressPoint progressPointInactive' />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
