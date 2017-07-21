import React from 'react'
import PropTypes from 'prop-types'

import './Snackbar.scss'

export default class Snackbar extends React.Component {

  static propTypes = {
    notice: PropTypes.object
  }

  render () {
    return (
      <div styleName='snackbar'>
        <span styleName='snackbar-entry'>
          <span styleName='entry-status'>New</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-datetime'>21:12, April 13, 2017</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-label'>Operation confirmed, signatures:</span>&nbsp;
          <span styleName='entry-value'>1</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-value'>Add CBE</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-label'>Name:</span>&nbsp;
          <span styleName='entry-value'>Orlando</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-value'>0x9831834F6ACA9831834F6ACA9831834F6ACA</span>
        </span>
      </div>
    )
  }
}
