import classnames from 'classnames'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { DUCK_WATCHER } from 'redux/watcher/actions'
import { DUCK_NOTIFIER } from 'redux/notifier/actions'
import Immutable from 'immutable'
import { connect } from "react-redux"
import React, { PureComponent } from 'react'
import ReceivedTransactionSVG from 'assets/img/r-0.svg'
import Value from 'components/common/Value/Value'
import AbstractNoticeModel from 'models/notices/AbstractNoticeModel'
import Moment from 'components/common/Moment'
import { FULL_DATE } from 'models/constants'
import { IconButton } from 'material-ui'
import { SIDES_CLOSE_ALL } from 'redux/sides/actions'
import { prefix } from './lang'
import './NotificationContent.scss'

export const NOTIFICATION_PANEL_KEY = 'NotificationContent_panelKey'

function mapStateToProps (state) {
  const { pendingTxs } = state.get(DUCK_WATCHER)
  const { list } = state.get(DUCK_NOTIFIER)
  return {
    noticesList: list,
    transactionsList: pendingTxs,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch({ type: SIDES_CLOSE_ALL }),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class NotificationContent extends PureComponent {
  static propTypes = {
    transactionsList: PropTypes.instanceOf(Immutable.Map),
    noticesList: PropTypes.instanceOf(Immutable.List),
    onClose: PropTypes.func,
  }

  handleClose = () => {
    this.props.onClose()
  }

  renderTransaction (trx) {
    const hash = trx.hash()
    const details = trx.details()

    return (
      <div key={trx.id()} styleName='tableItem'>
        <div styleName='itemLeft'>
          <img alt='' src={ReceivedTransactionSVG} />
        </div>
        <div styleName='itemInfo'>
          <div styleName='infoRow'>
            <div styleName='infoTitle'>{trx.title()}</div>
            {hash && <div styleName='info-address'>{hash}</div>}
          </div>
          {details && details.map((item, index) => {
            return (
              <div key={index} styleName='infoRow'>
                <div styleName='infoLabel'>{item.label}:</div>
                <div styleName='infoValue'><Value value={item.value} /></div>
              </div>
            )
          })}
        </div>
        <div styleName='itemRight' />
      </div>
    )
  }

  renderNotice (notice: AbstractNoticeModel) {
    const details = notice.details()

    return (
      <div key={notice.id()} styleName='tableItem'>
        <div styleName={classnames('itemLeft', { 'error': !!notice.error })}>
          {notice.icon()}
        </div>
        <div styleName='itemInfo'>
          <div styleName='infoRow'>
            <div styleName='infoTitle'>{notice.title()}</div>
          </div>
          <div styleName='infoRow'>
            <div styleName='infoLabel'>{notice.message()}</div>
          </div>
          {details && details.map((item, index) => (
            <div key={index} styleName='infoRow'>
              <div styleName='infoLabel'>{item.label}:</div>
              &nbsp;
              <div styleName='infoValue'><Value value={item.value} /></div>
            </div>
          ))}
          <div styleName='infoRow'>
            <div styleName='infoDatetime'><Moment date={notice.date()} format={FULL_DATE} /></div>
          </div>
        </div>
      </div>
    )
  }

  render () {

    const transactionsList = this.props.transactionsList.valueSeq().sortBy((n) => n.time()).reverse()
    const noticesList = this.props.noticesList.valueSeq().sortBy((n) => n.time()).reverse()

    return (
      <div styleName='root'>
        <div>
          <div styleName='section-header'>
            <div styleName='title'><Translate value={`${prefix}.currentTransactions`} /></div>
            <div styleName='close' onTouchTap={this.handleClose}>
              <IconButton>
                <i className='material-icons'>close</i>
              </IconButton>
            </div>
          </div>
          {transactionsList.isEmpty()
            ? (<div styleName='tableItem'><Translate value={`${prefix}.noTransactions`} /></div>)
            : transactionsList.map((item) => this.renderTransaction(item))
          }

          <div styleName='section-header'>
            <Translate value={`${prefix}.systemNotifications`} />
          </div>

          {noticesList.isEmpty()
            ? (<div styleName='tableItem'><Translate value={`${prefix}.noNotices`} /></div>)
            : noticesList.map((item) => this.renderNotice(item))
          }
        </div>
      </div>
    )
  }
}

export default NotificationContent
