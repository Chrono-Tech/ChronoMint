/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import menu from 'menu'
import { drawerHide } from 'redux/drawer/actions'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { getNetworkName } from '@chronobank/login/redux/network/thunks'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import { logoutAndNavigateToRoot } from 'redux/ui/thunks'
import { DEFAULT_AVATAR } from 'components/constants'
import chronoWalletLogoSVG from 'assets/img/chronowallettext-white.svg'
import ProfileImage from 'components/common/ProfileImage/ProfileImage'
import exitSvg from 'assets/img/exit-white.svg'
import { sidesCloseAll, sidesOpen } from 'redux/sides/actions'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { getAccountAvatar, getAccountName } from '@chronobank/core/redux/persistAccount/utils'
import { MENU_TOKEN_MORE_INFO_PANEL_KEY } from 'redux/sides/constants'
import { getWalletsLength } from '@chronobank/core/redux/wallets/selectors/wallets'
import { getAccountProfileSummary } from '@chronobank/core/redux/session/selectors'
import MenuTokensList from './MenuTokensList/MenuTokensList'
import { prefix } from './lang'

import './DrawerMainMenu.scss'

function mapStateToProps (state) {
  const { isCBE, profile } = state.get(DUCK_SESSION)
  const selectedAccount = state.get(DUCK_PERSIST_ACCOUNT).selectedWallet
  const accountProfileSummary = getAccountProfileSummary(state)

  return {
    selectedAccount: selectedAccount,
    walletsCount: getWalletsLength(state),
    isCBE,
    profile,
    isDrawerOpen: state.get('drawer').isOpen,
    avatar: accountProfileSummary.avatar,
    userName: accountProfileSummary.userName,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getNetworkName: () => dispatch(getNetworkName()),
    handleDrawerHide: () => dispatch(drawerHide()),
    handleLogout: () => dispatch(logoutAndNavigateToRoot()),
    handleProfileEdit: () => dispatch(modalsOpen({
      componentName: 'UpdateProfileDialog'
    })),
    handle: (handleClose) => {
      dispatch(sidesCloseAll())
      dispatch(sidesOpen({
        componentName: 'MenuAssetsManagerMoreInfo',
        panelKey: MENU_TOKEN_MORE_INFO_PANEL_KEY,
        isOpened: true,
        anchor: 'left',
        preCloseAction: handleClose,
        drawerProps: {
          width: 300,
        },
      }))
    },

    handleAssetsManagerMoreInfo: (handleClose) => {
      dispatch(sidesCloseAll())
      dispatch(sidesOpen({
        componentName: 'MenuAssetsManagerMoreInfo',
        panelKey: MENU_TOKEN_MORE_INFO_PANEL_KEY,
        isOpened: true,
        anchor: 'left',
        preCloseAction: handleClose,
        drawerProps: {
          width: 300,
        },
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DrawerMainMenu extends PureComponent {
  static propTypes = {
    isCBE: PropTypes.bool,
    handleProfileEdit: PropTypes.func,
    userName: PropTypes.string,
    handleLogout: PropTypes.func,
    walletsCount: PropTypes.number,
    handleAssetsManagerMoreInfo: PropTypes.func,
    onSelectLink: PropTypes.func,
    getNetworkName: PropTypes.func,
  }

  componentDidMount () {
    const mainMenu = this.mainMenu
    let timeoutId = null
    const margin = 30

    const callback = function () {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const styleTop = Number.parseFloat(mainMenu.style.top || 0)

        const downBackspace = window.innerHeight - (mainMenu.offsetHeight - window.pageYOffset + styleTop)
        const isStart = (mainMenu.getBoundingClientRect().top + document.body.scrollTop) > 0
        const isEnd = downBackspace > 0
        if (isStart && !isEnd) {
          mainMenu.style.top = window.pageYOffset + margin + 'px'
        }

        if (isEnd && !isStart) {
          mainMenu.style.top = styleTop + downBackspace - margin + 'px'
        }

      }, 100)
    }
    window.addEventListener('scroll', callback)

    this.componentWillUnmount = () => {
      window.removeEventListener('scroll', callback)
    }
  }

  handleShowAssetsManagerMore = (e) => {
    e.stopPropagation()
    this.props.handleAssetsManagerMoreInfo()
  }

  handleSelectLink = () => {
    this.props.onSelectLink()
  }

  setRef = (el) => {
    this.mainMenu = el
  }

  renderItem (item) {
    return (
      <div styleName={classnames('item')} key={item.key}>
        <div
          styleName='menuItem'
          activeclassname='drawer-item-active'
          to={{ pathname: item.path }}
          onClick={this.handleSelectLink}
        >
          <i styleName='icon' className='material-icons'>{item.icon}</i>
          <div styleName='title'>
            <Translate value={item.title} />
          </div>
        </div>
        {item.showMoreButton && (
          <div
            styleName={classnames('itemMenuMore' /*{ 'hover': !!token.address, 'selected': selectedToken && selectedToken.title === token.title }*/)}
            onClick={this.handleShowAssetsManagerMore}
          >
            <i className='material-icons'>more_vert</i>
          </div>
        )}
      </div>
    )
  }

  render () {
    const { selectedAccount, avatar, userName } = this.props

    return (
      <div styleName='root' className='root-open'>
        <div styleName='content'>
          <div
            id='mainMenu'
            styleName='menu'
            ref={this.setRef}
          >
            <div styleName='chronWalletLogo'>
              <img src={chronoWalletLogoSVG} alt='ChronoWallet logo' />
              <div styleName='subtitle'>{require('../../../../package.json').version}</div>
            </div>

            <div styleName={classnames('account-info', 'item')}>
              <div styleName='account-info-avatar'>
                <div styleName='avatar-icon' onClick={this.props.handleProfileEdit}>
                  <ProfileImage
                    styleName='avatar-icon-content'
                    imageId={avatar}
                    icon={<div styleName='emptyAvatar'><img styleName='avatar-image' src={getAccountAvatar(selectedAccount) || DEFAULT_AVATAR} alt='avatar' /></div>}
                  />
                </div>
              </div>
              <div styleName='account-info-name'>
                <div styleName='account-name-text'>
                  {userName || getAccountName(selectedAccount) || 'Account name'}
                </div>
                <div styleName='network-name-text'>
                  {this.props.getNetworkName()}
                </div>
              </div>
              <div styleName='exit' onClick={this.props.handleLogout}>
                <img src={exitSvg} alt='logout' title={I18n.t(`${prefix}.logout`)} />
              </div>
            </div>

            <Link
              activeclassname='drawer-item-active'
              to='/wallets'
              onClick={this.handleSelectLink}
              styleName={classnames('menuItem', 'item')}
            >
              <i styleName='icon' className='material-icons'>account_balance_wallet</i>
              <div styleName='title'>
                <Translate value='Wallets' />
              </div>
              <div styleName='count'>{this.props.walletsCount}</div>
            </Link>

            <MenuTokensList onSelectLink={this.handleSelectLink} />

            {!menu.user ? null : (
              <div styleName='menu-user'>
                {menu.user.map((item) => this.renderItem(item))}
                {this.props.isCBE && menu.cbe.map((item) => this.renderItem(item))}
              </div>
            )}

            <div styleName='socialItems'>
              <a href='https://www.facebook.com/ChronoBank.io' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                <i styleName='facebook' />
              </a>
              <a href='https://twitter.com/ChronobankNews' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                <i styleName='twitter' />
              </a>
              <a href='https://www.instagram.com/chronobank.io/' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                <i styleName='instagram' />
              </a>
              <a href='https://www.reddit.com/r/ChronoBank/' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                <i styleName='reddit-alien' />
              </a>
              <a href='https://telegram.me/ChronoBank' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                <i styleName='telegram' />
              </a>
              <a href='https://github.com/ChronoBank' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                <i styleName='github' />
              </a>
            </div>

            <div styleName='contacts'>
              <a href='mailto:info@chronobank.io'>info@chronobank.io</a>
              <a href='mailto:support@chronobank.io'>support@chronobank.io</a>
            </div>

            <div styleName='externalMenuItems'>
              {menu.global.map((item) => (
                <a
                  key={item.key}
                  href={item.path}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Translate value={item.title} />
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>)
  }
}
