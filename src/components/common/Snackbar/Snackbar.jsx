import React from 'react'
import PropTypes from 'prop-types'

import './Snackbar.scss'

export default class Snackbar extends React.Component {

  static propTypes = {
    notice: PropTypes.object
  }

  render () {

    const notice = this.props.notice
    const address = notice.address()

    return (
      <div styleName='snackbar'>
        <span styleName='snackbar-entry'>
          <span styleName='entry-status'>{notice.title()}</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-datetime'>{notice.date('HH:mm, MMMM Do, YYYY')}</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-value'>{notice.message()}</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-label'>Operation confirmed, signatures:</span>&nbsp;
          <span styleName='entry-value'>1</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-label'>Name:</span>&nbsp;
          <span styleName='entry-value'>Orlando</span>
        </span>
        {address
          ? (
            <span styleName='snackbar-entry'>
              <span styleName='entry-value'>0x9831834F6ACA9831834F6ACA9831834F6ACA</span>
            </span>
          )
          : null
        }
      </div>
    )
  }
}
