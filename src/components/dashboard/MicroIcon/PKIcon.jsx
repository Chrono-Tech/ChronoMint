import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ArbitraryNoticeModel from 'models/notices/ArbitraryNoticeModel'
import { modalsOpen } from 'redux/modals/actions'
import { notify } from 'redux/notifier/actions'
import CopyDialog from 'components/dialogs/CopyDialog/CopyDialog'
import clipboard from 'utils/clipboard'
import { getPrivateKeyFromSymbol } from '@chronobank/login/redux/network/actions'

import './MicroIcon.scss'

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
    notify: () => dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.profile.pkIcon' }), false)),
  }
}

function mapStateToProps (state, props) {
  return {
    show: !!getPrivateKeyFromSymbol(props.symbol),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PKIcon extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    symbol: PropTypes.string,
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
        copyValue: getPrivateKeyFromSymbol(this.props.symbol),
        title: <Translate value='dialogs.copyPrivateKey.title' />,
        controlTitle: <Translate value='dialogs.copyPrivateKey.controlTitle' />,
        description: <Translate value='dialogs.copyPrivateKey.description' />,
      })
    } else {
      clipboard.copy(getPrivateKeyFromSymbol(this.props.symbol))
      this.props.notify()
    }
  }

  render () {
    return this.props.show ?
      (
        <div styleName='root'>
          <span styleName={this.props.iconStyle} onTouchTap={this.handleCopy}>
            <i className='material-icons'>vpn_key</i>
          </span>
        </div>
      )
      : null
  }

}
