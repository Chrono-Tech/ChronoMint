/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { Button } from 'components'

import Trezor from 'assets/img/icons/trezor-white.svg'
import Ledger from 'assets/img/icons/ledger-nano-white.svg'
import Plugin from 'assets/img/icons/plugin-white.svg'
import Mnemonic from 'assets/img/icons/mnemonic-white.svg'
import Key from 'assets/img/icons/key-white.svg'
import Wallet from 'assets/img/icons/wallet-white.svg'
import Uport from 'assets/img/icons/uport.svg'

// import styles from 'layouts/Splash/styles'
import './ImportMethodsPage.scss'

export default class ImportMethodsPage extends PureComponent {
  render () {
    return (
      <MuiThemeProvider>
        <div styleName='page'>

          <div styleName='page-title'>Add an Existing Account</div>

          <div styleName='methods'>
            <Button styleName='button button-trezor'>
              <img src={Trezor} alt='' />
              <br />
              Trezor
            </Button>

            <Button styleName='button button-ledger'>
              <img src={Ledger} alt='' />
              <br />
              LedgerNano
            </Button>

            <Button styleName='button button-plugin'>
              <img src={Plugin} alt='' />
              <br />
              Browser Plugin
            </Button>

            <Button styleName='button'>
              <img src={Mnemonic} alt='' />
              <br />
              Mnemonic
            </Button>

            <Button styleName='button'>
              <img src={Key} alt='' />
              <br />
              Private Key
            </Button>

            <Button styleName='button'>
              <img src={Wallet} alt='' />
              <br />
              Wallet File
            </Button>

            <Button styleName='button button-uport'>
              <img src={Uport} alt='' />
              <br />
              Uport
            </Button>
          </div>

          <div styleName='actions'>
            or <br />
            <Link to='/' href styleName='link'>Create New Account</Link>
          </div>

        </div>
      </MuiThemeProvider>
    )
  }
}
