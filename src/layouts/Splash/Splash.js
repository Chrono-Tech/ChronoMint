/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import WalletTitleBG from 'assets/img/wallet-title-bg.png'
import StripesToCrop from 'assets/img/stripes-2-crop.jpg'
import ChronoWalletLogoBright from 'assets/img/chronowalletlogobright.svg'
import ChronoWalletTextBright from 'assets/img/chronowallettextbright.svg'

import Footer from '../Footer/Footer'

import './Splash.scss'

class Splash extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='header-container'>
          <div styleName='header-picture'>
            <img src={StripesToCrop} />
          </div>
          <div styleName='header-picture-crop'>
            <img src={WalletTitleBG} />
          </div>
          <div styleName='header-logos'>
            <img styleName='chrono-wallet-logo-bright' src={ChronoWalletLogoBright} />
            <img styleName='chrono-wallet-text-bright' src={ChronoWalletTextBright} />
          </div>
        </div>
        <div styleName='content'>
          <div styleName='create-title'>
            {'Create New Account'}
          </div>
          <div styleName='create-title-description'>
            {'Created wallet will be encrypted using given password and stored in your browser\'s local storage.'}
          </div>
        </div>
        {!window.isMobile && (<Footer />)}
      </div>
    )
  }
}

export default Splash
