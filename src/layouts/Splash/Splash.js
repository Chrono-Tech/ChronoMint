/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import WalletTitleBG from 'assets/img/wallet-title-bg.png'
import StripesToCrop from 'assets/img/stripes-2-crop.jpg'

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
          <div styleName='header-picture'>
            <img src={WalletTitleBG} />
          </div>
        </div>
        <div styleName='content'>
          {this.props.children}
        </div>
        {!window.isMobile && (<Footer />)}
      </div>
    )
  }
}

export default Splash
