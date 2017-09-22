import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ChronoBankLogo.scss'

class ChronoBankLogo extends Component {

  static propTypes = {
    version: PropTypes.string
  }
  render () {
    const {version} = this.props
    return (
      <a href={window.isMobile ? '' : 'https://chronobank.io'} styleName='root'>
        <div styleName='img' />
        <div styleName='text'>
          <span styleName='chrono'>Chrono</span>
          <span styleName='bank'>bank.io</span>
          {version && <sup styleName='version'>{version}</sup>}
        </div>
      </a>
    )
  }
}

export default ChronoBankLogo
