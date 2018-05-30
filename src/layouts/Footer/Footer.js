/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form/immutable'

import { Button } from 'components'
import { TextField } from 'redux-form-material-ui'
import LogoChronobankFull from 'assets/img/logo-chrono-bank-full.svg'
import PlayWhite from 'assets/img/play-white.svg'
import AppstoreWhite from 'assets/img/appstore-white.svg'
import facebook from 'assets/img/facebook.svg'
import reddit from 'assets/img/reddit.svg'
import instagram from 'assets/img/instagram.svg'
import github from 'assets/img/github.svg'
import twitter from 'assets/img/twitter.svg'
import telegramm from 'assets/img/telegramm.svg'
import StripesToCropFooter from 'assets/img/stripes-2-crop-footer.jpg'

import './Footer.scss'
import styles from './styles'

const FORM_FOOTER_EMAIL_SUBSCRIPTION = 'FooterEmailSubscriptionForm'

@reduxForm({ form: FORM_FOOTER_EMAIL_SUBSCRIPTION })
export default class Footer extends Component {
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
              <li styleName='first'>info@chronobank.io</li>
              <li>support@chronobank.io</li>
            </ul>
          </div>

          <form name={FORM_FOOTER_EMAIL_SUBSCRIPTION} styleName='subscription'>
            <div styleName='subscription-input'>
              <Field
                component={TextField}
                name='email'
                floatingLabelText='Enter email to subscribe for newsletter'
                fullWidth
                {...styles.textField}
              />
            </div>
            <div styleName='subscription-button'>
              <Button
                styleName='button'
                label={<Translate value='subscribe' />}
              />
            </div>
          </form>

        </div>
        <div styleName='copyright'>
          <span styleName='copyright-text'>
            {<Translate value={'copyright'} />}
          </span>
        </div>

        <img styleName='background' src={StripesToCropFooter} alt='' />

      </div>
    )
  }
}
