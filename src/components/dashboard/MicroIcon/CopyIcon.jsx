import { I18n } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import ArbitraryNoticeModel from 'models/notices/ArbitraryNoticeModel'

import { modalsOpen } from 'redux/modals/actions'
import { notify } from 'redux/notifier/actions'

import CopyDialog from 'components/dialogs/CopyDialog'

import clipboard from 'utils/clipboard'

import './MicroIcon.scss'

@connect(null, mapDispatchToProps)
export default class CopyIcon extends React.Component {
  static propTypes = {
    value: PropTypes.node,
    notify: PropTypes.func,
    onModalOpen: PropTypes.func,
    showCopyDialog: PropTypes.func,
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
      if (this.props.onModalOpen) {
        this.props.onModalOpen()
      }
      this.props.showCopyDialog({
        copyValue: this.props.value,
        title: I18n.t('dialogs.copyAddress.title'),
        controlTitle: I18n.t('dialogs.copyAddress.controlTitle'),
        description: I18n.t('dialogs.copyAddress.description'),
      })
    } else {
      clipboard.copy(this.props.value)
      this.props.notify()
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showCopyDialog: ({
      copyValue, title, controlTitle, description,
    }) => dispatch(modalsOpen({
      component: CopyDialog,
      props: {
        copyValue,
        title,
        controlTitle,
        description,
      },
    })),
    notify: () => dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.profile.copyIcon' }), false)),
  }
}
