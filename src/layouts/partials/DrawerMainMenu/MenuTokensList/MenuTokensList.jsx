/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { selectCurrentNetworkTitle } from '@chronobank/nodes/redux/selectors'
import { Translate, I18n } from 'react-redux-i18n'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { drawerHide, drawerToggle } from 'redux/drawer/actions'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { logoutAndNavigateToRoot } from 'redux/ui/thunks'
import { getBlockchainAddressesList } from '@chronobank/core/redux/session/selectors'
import { sidesCloseAll, sidesOpen } from 'redux/sides/actions'
import { MENU_TOKEN_MORE_INFO_PANEL_KEY } from 'redux/sides/constants'
import { prefix } from './lang'

import './MenuTokensList.scss'

function makeMapStateToProps (state) {
  const getwallets = getBlockchainAddressesList()
  const currentNetworkName = selectCurrentNetworkTitle(state)
  const mapStateToProps = (ownState) => {
    const session = ownState.get(DUCK_SESSION)
    return {
      currentNetworkName,
      account: session.account,
      tokens: getwallets(ownState),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleDrawerHide: () => dispatch(drawerHide()),
    handleLogout: () => dispatch(logoutAndNavigateToRoot()),
    initTokenSide: (token) => dispatch(sidesOpen({
      componentName: 'MenuTokenMoreInfo',
      panelKey: MENU_TOKEN_MORE_INFO_PANEL_KEY + '_' + token.blockchain,
      isOpened: false,
    })),
    handleTokenMoreInfo: (selectedToken, handleClose, isClose) => {
      dispatch(sidesCloseAll())
      if (!isClose) {
        dispatch(sidesOpen({
          componentName: 'MenuTokenMoreInfo',
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
    tokens: PropTypes.arrayOf(PropTypes.object),
    handleTokenMoreInfo: PropTypes.func,
    initTokenSide: PropTypes.func,
    currentNetworkName: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.tokens.forEach((token) => {
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

  render () {
    const setToken = (token, isClose) => {
      return () => {
        if (token.address) {
          this.handleSelectToken(token, isClose)
        }
      }
    }
    const { selectedToken } = this.state
    const { currentNetworkName } = this.props

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
                    title={I18n.t(`${prefix}.${token.address ? 'synced' : 'offline'}`, { currentNetworkName })}
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
