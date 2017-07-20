import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'

import ArbitraryNoticeModel from 'models/notices/ArbitraryNoticeModel'

import clipboard from 'utils/clipboard'
import { notify } from 'redux/notifier/actions'

import './MicroIcon.scss'

const mapDispatchToProps = (dispatch) => ({
  notify: () => dispatch(notify(new ArbitraryNoticeModel('notices.profile.copyIcon'), false))
})

@connect(null, mapDispatchToProps)
export default class CopyIcon extends React.Component {

  static propTypes = {
    value: PropTypes.node,
    notify: PropTypes.func
  }

  render () {
    return (
      <div styleName='root'>
        <a styleName='micro' onTouchTap={(e) => { e.preventDefault(); this.handleCopy() }}>
          <i className='material-icons'>content_copy</i>
        </a>
      </div>
    )
  }

  handleCopy () {
    clipboard.copy(this.props.value)
    this.props.notify()
  }
}
