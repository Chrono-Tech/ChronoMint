/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Button } from 'components'
import { TextField } from 'redux-form-material-ui'
import ChronoBankLogo from 'components/common/ChronoBankLogo/ChronoBankLogo'
import LogoChronobankFull from 'assets/img/logo-chrono-bank-full.svg'
import PlayWhite from 'assets/img/play-white.svg'
import AppstoreWhite from 'assets/img/appstore-white.svg'
import facebook from 'assets/img/facebook.svg'
import reddit from 'assets/img/reddit.svg'
import instagram from 'assets/img/instagram.svg'
import github from 'assets/img/github.svg'
import twitter from 'assets/img/twitter.svg'
import telegramm from 'assets/img/telegramm.svg'

import './Footer.scss'

class Footer extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    return (
      <div styleName='footer'>
        <div styleName='footer-container'>
          <div styleName='navigation'>
            <div styleName='navigation-chrono-logo-container'>
              <img styleName='navigation-chrono-logo' src={LogoChronobankFull} />
            </div>

            <ul styleName='navigation-list' >
              <li>Home</li>
              <li>LaborX</li>
              <li>Team</li>
              <li>FAQ</li>
              <li>Blog</li>
              <li>Business Outline</li>
              <li>Development Plan</li>
              <li>White Paper</li>
            </ul>

          </div>

          <div styleName='downloads'>
            <div styleName='title-container'>
              <span styleName='title'>Downloads</span>
            </div>

            <div styleName='market-logo-container'>
              <img styleName='ios-market-logo ' src={AppstoreWhite} />
            </div>

            <div styleName='market-logo-container'>
              <img styleName='android-market-logo ' src={PlayWhite} />
            </div>

            <ul styleName='navigation-list' >
              <li>Desktop App (Windows)</li>
              <li>Desktop App (MacOS)</li>
            </ul>

            <div styleName='subscription'>
              <div styleName='subscription-input'>
                <TextField fullWidth placeholder={'Enter email to subscribe for newsletter'} />
              </div>
              <div styleName='subscription-button'>
                <Button
                  styleName='button'
                  label={<Translate value='subscribe' />}
                />
              </div>
            </div>
          </div>

          <div styleName='connect'>
            <div styleName='title-container'>
              <span styleName='title'>{'Connect with us'}</span>
            </div>
            <div styleName='logos-container'>
              <div styleName='logo'>
                <img styleName='img-logo' src={facebook} />
              </div>
              <div styleName='logo'>
                <img styleName='img-logo' src={twitter} />
              </div>
              <div styleName='logo'>
                <img styleName='img-logo' src={instagram} />
              </div>
              <div styleName='logo'>
                <img styleName='img-logo' src={reddit} />
              </div>
              <div styleName='logo'>
                <img styleName='img-logo' src={telegramm} />
              </div>
              <div styleName='logo'>
                <img styleName='img-logo' src={github} />
              </div>
            </div>

            <ul styleName='navigation-list' >
              <li>info@chronobank.io</li>
              <li>support@chronobank.io</li>
            </ul>
          </div>
        </div>
        <div styleName='copyright'>
          <span styleName='copyright-text'>
            {<Translate value={'copyright'} />}
          </span>
        </div>

      </div>
    )
  }
}

export default Footer
