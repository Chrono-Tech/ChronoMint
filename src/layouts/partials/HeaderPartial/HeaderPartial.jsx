import {
  NETWORK_STATUS_OFFLINE,
  NETWORK_STATUS_ONLINE,
  NETWORK_STATUS_UNKNOWN,
  SYNC_STATUS_SYNCED,
  SYNC_STATUS_SYNCING,
} from '@chronobank/login/network/MonitorService'
import { getNetworkById } from '@chronobank/login/network/settings'
import { IPFSImage } from 'components'
import { SidePanel } from 'layouts/partials'
import Moment from 'components/common/Moment'
import { CircularProgress, FlatButton, FontIcon, IconButton, Popover } from 'material-ui'
import menu from 'menu'
import { FULL_DATE } from 'models/constants'
import type AbstractNoticeModel from 'models/notices/AbstractNoticeModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router'
import { drawerToggle } from 'redux/drawer/actions'
import { sidesPush } from 'redux/sides/actions'
import { readNotices } from 'redux/notifier/actions'
import { logout } from 'redux/session/actions'
import Value from 'components/common/Value/Value'
import { PROFILE_SIDE_PANEL_KEY } from 'components/common/SideStack/SideStack'
import ProfileContent from 'layouts/partials/ProfileContent/ProfileContent'
import ls from 'utils/LocalStorage'
import styles from '../styles'
import './HeaderPartial.scss'

function mapStateToProps (state) {
  const session = state.get('session')
  const wallet = state.get('mainWallet')
  const notifier = state.get('notifier')
  const watcher = state.get('watcher')
  const monitor = state.get('monitor')
  return {
    i18n: state.get('i18n'), // force update I18n.t
    wallet,
    account: session.account,
    profile: session.profile,
    noticesList: notifier.list,
    unreadNotices: notifier.unreadNotices,
    transactionsList: watcher.pendingTxs,
    network: getNetworkById(ls.getNetwork(), ls.getProvider(), true).name,
    isTokensLoaded: !wallet.isFetching(),
    isCBE: session.isCBE,
    tokens: wallet.tokens(),
    networkStatus: monitor.network,
    syncStatus: monitor.sync,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleLogout: () => dispatch(logout()),
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleProfileOpen: () => dispatch(sidesPush({
      component: ProfileContent,
      panelKey: PROFILE_SIDE_PANEL_KEY,
      isOpened: true,
    })),
    readNotices: () => dispatch(readNotices()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HeaderPartial extends PureComponent {
  static propTypes = {
    isCBE: PropTypes.bool,
    network: PropTypes.string,
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
    transactionsList: PropTypes.object,
    noticesList: PropTypes.object,
    unreadNotices: PropTypes.number,
    networkStatus: PropTypes.object,
    syncStatus: PropTypes.object,

    handleLogout: PropTypes.func,
    handleProfileEdit: PropTypes.func,
    handleDrawerToggle: PropTypes.func,
    handleProfileOpen: PropTypes.func,
    readNotices: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      isProfileOpen: false,
      profileAnchorEl: null,
      isNotificationsOpen: false,
      notificationsAnchorEl: null,
    }
  }

  handleClickOutside = () => {
    this.profilePopover.componentClickAway()
  }

  refPopover = (el) => {
    this.profilePopover = el
  }

  render () {
    const transactionsCount = this.props.transactionsList.count()
    const noticesCount = this.props.unreadNotices

    return (
      <div styleName='root'>
        <div styleName='menu' className={this.props.isCBE ? 'menu-cbe' : null}>
          <IconButton onTouchTap={this.props.handleDrawerToggle}>
            <FontIcon className='material-icons'>menu</FontIcon>
          </IconButton>
        </div>
        <div styleName='left'>
          <div styleName='routes'>
            {menu.user.map((item) => (
              <FlatButton
                key={item.key}
                styleName='route'
                style={styles.header.route.style}
                labelStyle={item.disabled ? styles.header.route.labelStyleDisabled : styles.header.route.labelStyle}
                label={<Translate value={item.title} />}
                disabled={item.disabled}
                icon={<FontIcon
                  className='material-icons'
                  style={item.disabled ? styles.header.route.iconStyleDisabled : null}
                >{item.icon}
                </FontIcon>}
                containerElement={!item.disabled
                  ? <Link activeClassName='active' to={{ pathname: item.path }} />
                  : <div />
                }
              />
            ))}
          </div>
        </div>
        <div styleName='center' />
        <div styleName='actions'>
          {/*
           TODO @bshevchenko
           <IconButton>
           <FontIcon className="material-icons">search</FontIcon>
           </IconButton>
          */}
          {this.renderStatus()}
          <div styleName='actionsEntry' onTouchTap={this.handleNotificationsOpen}>
            {transactionsCount
              ? (
                <div styleName='entryOverlay'>
                  <CircularProgress
                    size={40}
                    color={styles.header.progress.color}
                  />
                </div>
              )
              : null
            }
            <div styleName='entryButton'>
              <IconButton>
                <FontIcon className='material-icons'>notifications_active</FontIcon>
              </IconButton>
            </div>
            {noticesCount
              ? (
                <div styleName='entryOverlay'>
                  <div styleName='overlayCount'>{noticesCount}</div>
                </div>
              )
              : null
            }
          </div>
          <Popover
            ref={this.refPopover}
            className='popover popover-overflow-x-hidden'
            zDepth={3}
            style={styles.header.popover.style}
            open={this.state.isNotificationsOpen}
            anchorEl={this.state.notificationsAnchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            onRequestClose={this.handleNotificationsClose}
          >
            {this.renderNotifications()}
          </Popover>
        </div>
        <div styleName='right'>
          <div styleName='rightIcon' onTouchTap={this.props.handleProfileOpen}>
            <IPFSImage
              styleName='rightIconContent'
              multihash={this.props.profile.icon()}
              icon={(
                <FontIcon style={{ fontSize: 54 }} color='white' className='material-icons'>account_circle</FontIcon>)}
            />
          </div>
        </div>
      </div>
    )
  }

  renderStatus () {
    const { networkStatus, syncStatus } = this.props
    switch (networkStatus.status) {
      case NETWORK_STATUS_ONLINE: {
        switch (syncStatus.status) {
          case SYNC_STATUS_SYNCED:
            return (<div styleName='status status-synced' />)
          case SYNC_STATUS_SYNCING:
          default:
            return (<div styleName='status status-syncing' />)
        }
      }
      case NETWORK_STATUS_OFFLINE:
        return (<div styleName='status status-offline' />)
      case NETWORK_STATUS_UNKNOWN:
      default:
        return null
    }
  }

  renderNotifications () {
    const transactionsList = this.props.transactionsList.valueSeq().splice(15).sortBy((n) => n.time()).reverse()
    const noticesList = this.props.noticesList.valueSeq().splice(15).sortBy((n) => n.time()).reverse()

    return (
      <div styleName='notifications'>
        {transactionsList.isEmpty()
          ? null
          : (
            <div styleName='notificationsSection'>
              <div styleName='sectionHead'>
                <div styleName='headTitle'>
                  Pending transactions
                </div>
              </div>
              <div styleName='sectionBody sectionBodyDark'>
                <div styleName='bodyTable'>
                  {transactionsList.map((item) => this.renderTransaction(item))}
                </div>
              </div>
            </div>
          )
        }
        <div styleName='notificationsSection'>
          <div styleName='sectionHead'>
            <div styleName='headTitle'>
              Notifications
            </div>
          </div>
          <div styleName='sectionBody'>
            {noticesList.isEmpty()
              ? (<p style={{ marginBottom: '10px' }}>No notifications</p>)
              : (
                <div styleName='bodyTable'>
                  {noticesList.map((item) => this.renderNotice(item))}
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }

  renderTransaction (trx) {
    const hash = trx.hash()
    const details = trx.details()

    return (
      <div key={trx} styleName='tableItem'>
        <div styleName='itemLeft'>
          <i className='material-icons'>account_balance_wallet</i>
        </div>
        <div styleName='itemInfo'>
          <div styleName='infoRow'>
            <span styleName='infoTitle'>{trx.title()}</span>
            {hash
              ? (<span styleName='info-address'>{trx.hash()}</span>)
              : null
            }
          </div>
          {details && details.map((item, index) => (
            <div key={index} styleName='infoRow'>
              <span styleName='infoLabel'>{item.label}:</span>&nbsp;
              <span styleName='infoValue'><Value value={item.value} /></span>
            </div>
          ))}
          <div styleName='infoRow'>
            <span styleName='infoIcon'>
              <i className='material-icons'>access_time</i>
            </span>
            <span styleName='infoLabel'>Left about</span>&nbsp;
            <span styleName='infoValue'>&lt; 30 sec.</span>
          </div>
        </div>
        <div styleName='itemRight' />
      </div>
    )
  }

  renderNotice (notice: AbstractNoticeModel) {
    const details = notice.details()

    return (
      <div key={notice.id()} styleName='tableItem'>
        <div styleName='itemLeft'>
          {notice.icon()}
        </div>
        <div styleName='itemInfo'>
          <div styleName='infoRow'>
            <span styleName='infoTitle'>{notice.title()}</span>
          </div>
          <div styleName='infoRow'>
            <span styleName='infoLabel'>{notice.message()}</span>
          </div>
          {details && details.map((item, index) => (
            <div key={index} styleName='infoRow'>
              <span styleName='infoLabel'>{item.label}:</span>&nbsp;
              <span styleName='infoValue'><Value value={item.value} /></span>
            </div>
          ))}
          <div styleName='infoRow'>
            <span styleName='infoDatetime'><Moment date={notice.date()} format={FULL_DATE} /></span>
          </div>
        </div>
      </div>
    )
  }

  handleNotificationsOpen = (e) => {
    e.preventDefault()
    this.setState({
      isNotificationsOpen: true,
      notificationsAnchorEl: e.currentTarget,
    })
    this.props.readNotices()
  }

  handleNotificationsClose = () => {
    this.setState({
      isNotificationsOpen: false,
      notificationsAnchorEl: null,
    })
  }

  handleProfileClose = () => {
    this.setState({
      isProfileOpen: false,
      profileAnchorEl: null,
    })
  }

  handleProfileEdit = () => {
    this.handleProfileClose()
    this.props.handleProfileEdit()
  }
}
