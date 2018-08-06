/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import { I18n } from '@chronobank/core-dependencies/i18n'
import { Translate } from 'react-redux-i18n'
import { NETWORK_STATUS_OFFLINE, NETWORK_STATUS_ONLINE, NETWORK_STATUS_UNKNOWN, SYNC_STATUS_SYNCED, SYNC_STATUS_SYNCING } from '@chronobank/login/network/MonitorService'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { DUCK_MONITOR } from '@chronobank/login/redux/monitor/constants'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { drawerHide, drawerToggle } from 'redux/drawer/actions'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { logout } from '@chronobank/core/redux/session/actions'
import { getBlockchainAddressesList } from '@chronobank/core/redux/session/selectors'
import { sidesCloseAll, sidesPush } from 'redux/sides/actions'
import { MENU_TOKEN_MORE_INFO_PANEL_KEY } from 'redux/sides/constants'
import MenuTokenMoreInfo from '../MenuTokenMoreInfo/MenuTokenMoreInfo'
import { prefix } from './lang'

import './MenuTokensList.scss'

function makeMapStateToProps () {
  const getwallets = getBlockchainAddressesList()
  const mapStateToProps = (ownState) => {
    const session = ownState.get(DUCK_SESSION)
    const monitor = ownState.get(DUCK_MONITOR)
    return {
      account: session.account,
      tokens: getwallets(ownState),
      networkStatus: monitor.network,
      syncStatus: monitor.sync,
      networkName: networkService.getName(),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleDrawerHide: () => dispatch(drawerHide()),
    handleLogout: () => dispatch(logout()),
    initTokenSide: (token) => dispatch(sidesPush({
      component: MenuTokenMoreInfo,
      panelKey: MENU_TOKEN_MORE_INFO_PANEL_KEY + '_' + token.blockchain,
      isOpened: false,
    })),
    handleTokenMoreInfo: (selectedToken, handleClose, isClose) => {
      dispatch(sidesCloseAll())
      if (!isClose) {
        dispatch(sidesPush({
          component: MenuTokenMoreInfo,
          panelKey: MENU_TOKEN_MORE_INFO_PANEL_KEY + '_' + selectedToken.blockchain,
          isOpened: true,
          anchor: 'left',
          preCloseAction: handleClose,
          componentProps: {
            selectedToken,
          },
          drawerProps: {
            width: 300,
          },
        }))
      } else {
        handleClose()
      }
    },
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class MenuTokensList extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    tokens: PropTypes.arrayOf(PropTypes.object),
    handleTokenMoreInfo: PropTypes.func,
    networkStatus: PropTypes.shape({
      status: PropTypes.string,
    }),
    syncStatus: PropTypes.shape({
      status: PropTypes.string,
      progress: PropTypes.number,
    }),
    initTokenSide: PropTypes.func,
    networkName: PropTypes.string,
    onSelectLink: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.tokens.map((token) => {
      this.props.initTokenSide(token)
    })
  }

  handleSelectToken = (selectedToken, isClose) => {
    const handleClose = () => {
      this.setState({ selectedToken: null })
    }
    this.setState({ selectedToken })
    this.props.handleTokenMoreInfo(selectedToken, handleClose, isClose)
  }

  handleScrollToBlockchain = (blockchain) => {
    const element = document.getElementById(blockchain)
    if (element) {
      element.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }

  handleTouchTitle = (blockchain) => () => {
    return this.handleScrollToBlockchain(blockchain)
  }

  renderStatus () {
    const { networkStatus, syncStatus, networkName } = this.props

    switch (networkStatus.status) {
      case NETWORK_STATUS_ONLINE: {
        switch (syncStatus.status) {
          case SYNC_STATUS_SYNCED:
            return (<div styleName='icon status-synced' title={I18n.t(`${prefix}.synced`, { network: networkName })} />)
          case SYNC_STATUS_SYNCING:
          default:
            return (<div styleName='icon status-syncing' title={I18n.t(`${prefix}.syncing`, { network: networkName })} />)
        }
      }
      case NETWORK_STATUS_OFFLINE:
        return (<div styleName='icon status-offline' title={I18n.t(`${prefix}.offline`)} />)
      case NETWORK_STATUS_UNKNOWN:
      default:
        return null
    }
  }

  render () {
    const setToken = (token, isClose) => {
      return () => {
        if (token.address) {
          this.handleSelectToken(token, isClose)
        }
      }
    }

    const { selectedToken } = this.state
    return (
      <div styleName='root'>
        {this.props.tokens
          .map((token) => {
            const isSelect = selectedToken && selectedToken.title === token.title
            return (
              <div styleName='item' key={token.blockchain}>
                <div styleName='syncIcon'>
                  <span
                    styleName={classnames('icon', { 'status-synced': !!token.address, 'status-offline': !token.address })}
                    title={I18n.t(`${prefix}.${token.address ? 'synced' : 'offline'}`, { network: this.props.networkName })}
                  />
                </div>
                <div styleName='addressTitle' onClick={this.handleTouchTitle(token.blockchain)}>
                  <div styleName='addressName'>{token.title}</div>
                  <div styleName='address'>
                    <Translate value={`${prefix}.defaultWallet`} />{token.address || <Translate value={`${prefix}.notAvailable`} />}
                  </div>
                </div>
                <div
                  styleName={classnames('itemMenu', { 'hover': !!token.address, 'selected': isSelect })}
                  onClick={setToken(token, isSelect)}
                >
                  <i className='material-icons'>more_vert</i>
                </div>
              </div>
            )
          })}
      </div>
    )
  }
}
