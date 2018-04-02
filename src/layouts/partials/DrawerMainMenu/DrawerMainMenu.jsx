import { Link } from 'react-router'
import networkService from '@chronobank/login/network/NetworkService'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { I18n } from 'platform/i18n'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import menu from 'menu'
import { drawerHide, drawerToggle } from 'redux/drawer/actions'
import { DUCK_SESSION, logout } from 'redux/session/actions'
import chronWalletLogoSVG from 'assets/img/chronowallettext-white.svg'
import ProfileModel from 'models/ProfileModel'
import profileImgJPG from 'assets/img/profile-photo-1.jpg'
import { IPFSImage } from 'components'
import exitSvg from 'assets/img/exit-white.svg'
import { getWalletsCount } from 'redux/wallet/selectors'
import { SIDES_CLOSE_ALL, sidesPush } from 'redux/sides/actions'
import MenuAssetsManagerMoreInfo from './MenuAssetsManagerMoreInfo/MenuAssetsManagerMoreInfo'
import { MENU_TOKEN_MORE_INFO_PANEL_KEY } from './MenuTokenMoreInfo/MenuTokenMoreInfo'
import MenuTokensList from './MenuTokensList/MenuTokensList'
import { prefix } from './lang'
import './DrawerMainMenu.scss'

function mapStateToProps (state) {
  const { isCBE, profile } = state.get(DUCK_SESSION)

  return {
    walletsCount: getWalletsCount()(state),
    isCBE,
    profile,
    isDrawerOpen: state.get('drawer').isOpen,
    networkName: networkService.getName(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleDrawerHide: () => dispatch(drawerHide()),
    handleLogout: () => dispatch(logout()),
    handle: (handleClose) => {
      dispatch({ type: SIDES_CLOSE_ALL })
      dispatch(sidesPush({
        component: MenuAssetsManagerMoreInfo,
        panelKey: MENU_TOKEN_MORE_INFO_PANEL_KEY,
        isOpened: true,
        direction: 'left',
        preCloseAction: handleClose,
        drawerProps: {
          containerClassName: 'containerTokenSideMenu',
          overlayClassName: 'overlayTokenSideMenu',
          containerStyle: {
            width: '300px',
          },
          width: 300,
        },
      }))
    },

    handleAssetsManagerMoreInfo: (handleClose) => {
      dispatch({ type: SIDES_CLOSE_ALL })
      dispatch(sidesPush({
        component: MenuAssetsManagerMoreInfo,
        panelKey: MENU_TOKEN_MORE_INFO_PANEL_KEY,
        isOpened: true,
        direction: 'left',
        preCloseAction: handleClose,
        drawerProps: {
          containerClassName: 'containerTokenSideMenu',
          overlayClassName: 'overlayTokenSideMenu',
          containerStyle: {
            width: '300px',
          },
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
    handleDrawerToggle: PropTypes.func,
    handleDrawerHide: PropTypes.func,
    profile: PropTypes.instanceOf(ProfileModel),
    networkName: PropTypes.string,
    handleLogout: PropTypes.func,
    walletsCount: PropTypes.number,
    handleAssetsManagerMoreInfo: PropTypes.func,
    onSelectLink: PropTypes.func,
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
        <Link
          styleName='menuItem'
          activeClassName='drawer-item-active'
          to={{ pathname: item.path }}
          onTouchTap={this.handleSelectLink}
          href
        >
          <i styleName='icon' className='material-icons'>{item.icon}</i>
          <div styleName='title'>
            <Translate value={item.title} />
          </div>
        </Link>
        {item.showMoreButton && (
          <div
            styleName={classnames('itemMenuMore' /*{ 'hover': !!token.address, 'selected': selectedToken && selectedToken.title === token.title }*/)}
            onTouchTap={this.handleShowAssetsManagerMore}
          >
            <i className='material-icons'>more_vert</i>
          </div>
        )}
      </div>
    )
  }

  render () {

    return (
      <div styleName='root' className='root-open'>
        <div styleName='content'>
          <div
            id='mainMenu'
            styleName='menu'
            ref={this.setRef}
          >
            <div styleName='chronWalletLogo'>
              <img src={chronWalletLogoSVG} alt='ChronoWallet logo' />
              <div styleName='subtitle'>{require('../../../../package.json').version}</div>
            </div>

            <div styleName={classnames('account-info', 'item')}>
              <div styleName='account-info-avatar'>
                <div styleName='avatar-icon'>
                  <IPFSImage
                    styleName='avatar-icon-content'
                    multihash={this.props.profile.icon()}
                    icon={<div styleName='emptyAvatar'><img src={profileImgJPG} alt='avatar' /></div>}
                  />
                </div>
              </div>
              <div styleName='account-info-name'>
                <div styleName='account-name-text'>
                  {this.props.profile.name() || 'Account name'}
                </div>
                <div styleName='network-name-text'>
                  {this.props.networkName}
                </div>
              </div>
              <div styleName='exit' onTouchTap={this.props.handleLogout}>
                <img src={exitSvg} alt='logout' title={I18n.t(`${prefix}.logout`)} />
              </div>
            </div>

            <Link
              activeClassName='drawer-item-active'
              to='/wallet'
              onTouchTap={this.handleSelectLink}
              href
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
