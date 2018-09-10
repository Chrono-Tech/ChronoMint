/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ArbitraryNoticeModel from '@chronobank/core/models/notices/ArbitraryNoticeModel'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { notify } from '@chronobank/core/redux/notifier/actions'
import clipboard from 'utils/clipboard'
import { getPrivateKeyFromBlockchain } from '@chronobank/login/redux/network/utils'

import './MicroIcon.scss'

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
    notify: () => dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.profile.pkIcon' }), false)),
  }
}

function mapStateToProps (state, props) {
  return {
    show: !!getPrivateKeyFromBlockchain(props.blockchain),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PKIcon extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    blockchain: PropTypes.string,
    notify: PropTypes.func,
    onModalOpen: PropTypes.func,
    showCopyDialog: PropTypes.func,
    iconStyle: PropTypes.string,
  }

  static defaultProps = {
    iconStyle: 'micro',
  }

  handleCopy = (e) => {
    e.preventDefault()
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      if (this.props.onModalOpen) {
        this.props.onModalOpen()
      }
      this.props.showCopyDialog({
        copyValue: getPrivateKeyFromBlockchain(this.props.blockchain),
        title: <Translate value='dialogs.copyPrivateKey.title' />,
        controlTitle: <Translate value='dialogs.copyPrivateKey.controlTitle' />,
        description: <Translate value='dialogs.copyPrivateKey.description' />,
      })
    } else {
      clipboard.copy(getPrivateKeyFromBlockchain(this.props.blockchain))
      this.props.notify()
    }
  }

  render () {
    if (!this.props.show) {
      return null
    }

    return (
      <div styleName='root'>
        <span styleName={this.props.iconStyle} onClick={this.handleCopy}>
          <i className='material-icons'>vpn_key</i>
        </span>
      </div>
    )
  }

}
