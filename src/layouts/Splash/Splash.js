/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ChronoBankLogo from 'components/common/ChronoBankLogo/ChronoBankLogo'

import './Splash.scss'

class Splash extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <ChronoBankLogo version={require('../../../package.json').version} />
          {this.props.children}
        </div>
        {!window.isMobile && (
          <div styleName='footer'>
            <div styleName='copyright'><Translate value='copyright' /></div>
            <div styleName='links'>
              <a styleName='link' href='https://chronobank.io'><Translate value='chronobankSite' /></a>
              <a styleName='link' href='https://chronobank.io/faq'><Translate value='qa' /></a>
              <a styleName='link' href='https://chronobank.io/#contactus'><Translate value='contactUs' /></a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Splash
