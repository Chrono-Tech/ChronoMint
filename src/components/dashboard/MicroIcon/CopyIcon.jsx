import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'

import clipboard from 'utils/clipboard'
import { notify } from 'redux/notifier/actions'
import { modalsOpen } from 'redux/modals/actions'

import ArbitraryNoticeModel from 'models/notices/ArbitraryNoticeModel'
import CopyDialog from 'components/dialogs/CopyDialog'


import './MicroIcon.scss'

const mapDispatchToProps = (dispatch) => ({
  showCopyDialog: (copyValue) => dispatch(modalsOpen({
    component: CopyDialog,
    props: {
      copyValue,
      title: 'Copy address',
      controlTitle: 'Address',
      description: 'Press CTRL + C or ⌘ + C to copy address to clipboard'
    }
  })),
  notify: () => dispatch(notify(new ArbitraryNoticeModel('notices.profile.copyIcon'), false))
})

@connect(null, mapDispatchToProps)
export default class CopyIcon extends React.Component {

  static propTypes = {
    value: PropTypes.node,
    notify: PropTypes.func,
    showCopyDialog: PropTypes.func
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
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      this.props.showCopyDialog(this.props.value)
    } else {
      clipboard.copy(this.props.value)
      this.props.notify()
    }
  }
}
