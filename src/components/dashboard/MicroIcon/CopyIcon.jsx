/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ArbitraryNoticeModel from '@chronobank/core/models/notices/ArbitraryNoticeModel'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { notify } from '@chronobank/core/redux/notifier/actions'
import clipboard from 'utils/clipboard'

import './MicroIcon.scss'

@connect(null, mapDispatchToProps)
export default class CopyIcon extends PureComponent {
  static propTypes = {
    value: PropTypes.node,
    notify: PropTypes.func,
    onModalOpen: PropTypes.func,
    showCopyDialog: PropTypes.func,
    iconStyle: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    iconStyle: 'micro',
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

  render () {
    return (
      <div styleName='root' className='MicroIcon__root'>
        <a styleName={this.props.iconStyle} onClick={(e) => { e.preventDefault(); this.handleCopy() }} >
          {this.props.children
            ? this.props.children
            : <i className='material-icons'>content_copy</i>
          }
        </a>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showCopyDialog: ({ copyValue, title, controlTitle, description }) => dispatch(modalsOpen({
      componentName: 'CopyDialog',
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
