import { Link } from 'react-router'
import networkService from '@chronobank/login/network/NetworkService'
import { IPFSImage } from 'components'
import { List, ListItem, IconButton, FontIcon } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import menu from 'menu'
import { drawerToggle, drawerHide } from 'redux/drawer/actions'
import { logout } from 'redux/session/actions'
import chronWalletLogoSVG from 'assets/img/chronowallettext-white.svg'
import ProfileModel from 'models/ProfileModel'
import profileImgJPG from 'assets/img/profile-photo-1.jpg'
import exitSvg from 'assets/img/exit-white.svg'
import styles from '../styles'

import './DrawerMainMenu.scss'

function mapStateToProps (state) {
  const session = state.get('session')
  return {
    isCBE: state.get('session').isCBE,
    profile: session.profile,
    isDrawerOpen: state.get('drawer').isOpen,
    networkName: networkService.getName(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleDrawerHide: () => dispatch(drawerHide()),
    handleLogout: () => dispatch(logout()),
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
  }

  renderItem (item) {
    return (
      <ListItem
        key={item.key}
        style={item.disabled ? styles.drawer.item.styleDisabled : styles.drawer.item.style}
        innerDivStyle={styles.drawer.item.innerDivStyle}
        disabled={item.disabled}
        primaryText={<Translate value={item.title} />}
        onTouchTap={this.props.handleDrawerHide}
        leftIcon={
          <FontIcon
            style={item.disabled ? styles.drawer.item.iconStyleDisabled : styles.drawer.item.iconStyle}
            className='material-icons'
          >{item.icon}
          </FontIcon>
        }
        containerElement={!item.disabled
          ? <Link
            styleName='item'
            activeClassName='drawer-item-active'
            to={{ pathname: item.path }}
          />
          : <div />
        }
      />
    )
  }

  render () {

    return (
      <div
        styleName='root'
        className={classnames(this.props.isCBE ? 'root-cbe' : null, 'root-open')}
      >
        <div styleName='content'>

          <div styleName='chronWalletLogo'>
            <img src={chronWalletLogoSVG} alt='ChronoWallet logo' />
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
              <img src={exitSvg} alt='logout' />
            </div>
          </div>

          <div styleName={classnames('wallets', 'item')} />
          <div styleName='menu'>
            <IconButton onTouchTap={this.props.handleDrawerToggle}>
              <FontIcon className='material-icons'>menu</FontIcon>
            </IconButton>
          </div>

          {!menu.user ? null : (
            <List styleName='menu-user'>
              {menu.user.map((item) => this.renderItem(item))}
            </List>
          )}
          {!this.props.isCBE ? null : (
            <List styleName='menu-cbe'>
              {menu.cbe.map((item) => this.renderItem(item))}
            </List>
          )}
        </div>
      </div>
    )
  }
}
