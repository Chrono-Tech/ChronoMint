/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { CommonNetworkSelector } from '@chronobank/login-ui/components'
import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'
import { ModalStack } from 'components'
import { MuiThemeProvider } from '@material-ui/core/styles'

import WalletTitleBG from 'assets/img/wallet-title-bg.png'
import StripesToCrop from 'assets/img/stripes-2-crop.jpg'
import ChronoWalletLogoBright from 'assets/img/chronowalletlogobright.svg'
import ChronoWalletTextBright from 'assets/img/chronowallettextbright.svg'
import ChronoLogo from 'assets/img/logo-chrono-bank-full.svg'
import BackIcon from 'assets/img/icons/back.svg'

import Footer from '../Footer/Footer'
import PersistWrapper from '../partials/PersistWrapper/PersistWrapper'

import './Splash.scss'
import theme from './styles'

export default class Splash extends Component {
  static propTypes = {
    children: PropTypes.node,
    goBack: PropTypes.func,
    navigatorText: PropTypes.string,
  }

  static defaultProps = {
    goBack: null,
    navigatorText: '',
  }

  render () {
    const { children, goBack, navigatorText } = this.props

    return (
      <MuiThemeProvider theme={theme}>
        <div styleName='root'>
          <div styleName='header-container'>
            <div styleName='header-logo'>
              <img styleName='chrono-logo' src={ChronoLogo} alt='' />
            </div>
            <div styleName='header-picture'>
              <img src={StripesToCrop} alt='' />
            </div>
            <div styleName='header-picture-crop'>
              <img src={WalletTitleBG} alt='' />
            </div>
            <div styleName='header-center'>
              <img styleName='chrono-wallet-logo-bright' src={ChronoWalletLogoBright} alt='' />
              <img styleName='chrono-wallet-text-bright' src={ChronoWalletTextBright} alt='' />
            </div>
            <div styleName='selectors'>
              <div styleName='network-selector'>
                <CommonNetworkSelector />
              </div>
              <div styleName='lang-selector'>
                <LocaleDropDown newButtonStyle />
              </div>
            </div>
          </div>

          {
            goBack ? (
              <div styleName='header-navigator'>
                <button styleName='back-button' onClick={goBack}>
                  <img src={BackIcon} alt='' />
                </button>
                <span styleName='navigator-text'>
                  { navigatorText }
                </span>
              </div>
            ) : null
          }

          <PersistWrapper>
            {children ? children: null}
          </PersistWrapper>

          {!window.isMobile && (<Footer />)}

          <ModalStack />
        </div>
      </MuiThemeProvider>
    )
  }
}

