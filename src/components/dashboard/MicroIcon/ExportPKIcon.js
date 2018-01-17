import { I18n } from 'platform/i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ArbitraryNoticeModel from 'models/notices/ArbitraryNoticeModel'
import { modalsOpen } from 'redux/modals/actions'
import { notify } from 'redux/notifier/actions'
import CopyDialog from 'components/dialogs/CopyDialog'
import clipboard from 'utils/clipboard'

import './MicroIcon.scss'

function mapStateToProps (state) {
  return {
    canExport: state.get('network').canExport,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showCopyDialog: ({ copyValue, title, controlTitle, description }) => dispatch(modalsOpen({
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

@connect(mapStateToProps, mapDispatchToProps)
export default class ExportPKIcon extends PureComponent {
  static propTypes = {
    canExport: PropTypes.bool,
    value: PropTypes.node,
    notify: PropTypes.func,
    onModalOpen: PropTypes.func,
    showCopyDialog: PropTypes.func,
  }

  handleCopy = (e) => {
    e.preventDefault()
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
    return this.props.canExport ? (
      <div styleName='root'>
        <button  styleName='micro' onTouchTap={this.handleCopy}>
          <i className='material-icons'>vpn_key</i>
        </button>
      </div>
    ) : null
  }
}
