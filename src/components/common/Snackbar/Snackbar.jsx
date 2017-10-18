import PropTypes from 'prop-types'
import React from 'react'

import './Snackbar.scss'

export default class Snackbar extends React.Component {
  static propTypes = {
    notice: PropTypes.object,
    autoHideDuration: PropTypes.number,
    onRequestClose: PropTypes.func,
  }

  static defaultProps = {
    autoHideDuration: 4000,
  }

  constructor (props) {
    super(props)
    this.state = {
      notice: props.notice,
      timeout: props.notice
        ? setTimeout(() => {
          this.handleRequestClose()
        }, props.autoHideDuration)
        : null,
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.notice !== this.state.notice) {
      if (this.state.timeout) {
        clearTimeout(this.state.timeout)
      }
      this.setState({
        notice: newProps.notice,
        timeout: newProps.notice
          ? setTimeout(() => {
            this.handleRequestClose()
          }, this.props.autoHideDuration)
          : null,
      })
    }
  }

  render () {
    const notice = this.props.notice
    const address = notice.address()

    return (
      <div styleName='snackbar'>
        <span styleName='snackbar-entry'>
          <span styleName='entry-status'>{notice.title()}</span>
        </span>
        {/*
        <span styleName='snackbar-entry'>
          <span styleName='entry-datetime'>{notice.date('HH:mm, MMMM Do, YYYY')}</span>
        </span>
        */}
        <span styleName='snackbar-entry'>
          <span styleName='entry-value'>{notice.message()}</span>
        </span>
        {/*
        <span styleName='snackbar-entry'>
          <span styleName='entry-label'>Operation confirmed, signatures:</span>&nbsp;
          <span styleName='entry-value'>1</span>
        </span>
        <span styleName='snackbar-entry'>
          <span styleName='entry-label'>Name:</span>&nbsp;
          <span styleName='entry-value'>Orlando</span>
        </span>
        */}
        {address
          ? (
            <span styleName='snackbar-entry'>
              <span styleName='entry-value'>{address}</span>
            </span>
          )
          : null
        }
      </div>
    )
  }

  handleRequestClose () {
    if (this.props.onRequestClose) {
      this.props.onRequestClose()
    }
  }
}
