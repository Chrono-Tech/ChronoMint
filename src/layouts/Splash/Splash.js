import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ChronoBankLogo from 'components/common/ChronoBankLogo/ChronoBankLogo'
import './Splash.scss'

class Splash extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <ChronoBankLogo version='v0.2.1' />
          {this.props.children}
        </div>
        { !window.isMobile && (
          <div styleName='footer'>
            <div styleName='copyright'>Copyright ©2017 Edway Group Pty. Ltd. All Rights Reserved.</div>
            <div styleName='links'>
              <a styleName='link' href='https://chronobank.io'>Chronobank.io</a>
              <a styleName='link' href='https://chronobank.io/faq'>Q&A</a>
              <a styleName='link' href='https://chronobank.io/#contactus'>Contact Us</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Splash
