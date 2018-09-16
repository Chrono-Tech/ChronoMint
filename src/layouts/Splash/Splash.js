/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import CommonNetworkSelector from '@chronobank/login-ui/components/CommonNetworkSelector/CommonNetworkSelector'
import {
  navigateToLoginPage,
} from '@chronobank/login-ui/redux/navigation'
import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'
import ModalStack from 'components/common/ModalStack/ModalStack'
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

function mapStateToProps (state) {
  return {
    router: state.get('router'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateToLoginPage: () => dispatch(navigateToLoginPage()),
  }
}

class Splash extends Component {
  static propTypes = {
    children: PropTypes.node,
    goBack: PropTypes.func,
    navigateToLoginPage: PropTypes.func,
    navigatorText: PropTypes.string,
    router: PropTypes.any,
  }

  static defaultProps = {
    goBack: null,
    navigatorText: '',
  }

  render () {
    const { children, goBack, navigatorText, navigateToLoginPage, router } = this.props
    const location = router.toJS().location

    return (
      <MuiThemeProvider theme={theme}>
        <div styleName='root'>
          <div styleName='header-container'>
            <a styleName='header-logo' href='https://chronobank.io/'>
              <img styleName='chrono-logo' src={ChronoLogo} alt='' />
            </a>
            <div styleName='header-picture'>
              <img src={StripesToCrop} alt='' />
            </div>
            <div styleName='header-picture-crop'>
              <img src={WalletTitleBG} alt='' />
            </div>
            <button onClick={navigateToLoginPage} styleName='header-center'>
              <img styleName='chrono-wallet-logo-bright' src={ChronoWalletLogoBright} alt='' />
              <img styleName='chrono-wallet-text-bright' src={ChronoWalletTextBright} alt='' />
            </button>
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
            <div className={location.pathname}>
              {children ? children: null}
            </div>
          </PersistWrapper>

          {!window.isMobile && (<Footer />)}

          <ModalStack />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash)
