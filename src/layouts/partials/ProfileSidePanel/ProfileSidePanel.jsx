import { connect } from "react-redux"
import PropTypes from "prop-types"
import React, { PureComponent } from 'react'
import { logout } from 'redux/session/actions'
import {  FontIcon, Drawer } from 'material-ui'
import { modalsOpen } from 'redux/modals/actions'
import { IPFSImage, QRIcon, PKIcon, CopyIcon, TokenValue, UpdateProfileDialog } from 'components'
import GasSlider from 'components/common/GasSlider/GasSlider'
import networkService from '@chronobank/login/network/NetworkService'
import { TOKEN_ICONS } from 'assets'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { sidesClose } from 'redux/sides/actions'

import './ProfileSidePanel.scss'

export const PROFILE_SIDE_PANEL_KEY = 'ProfileSidePanelKey'

function mapStateToProps (state) {
  const session = state.get('session')
  const wallet = state.get('mainWallet')
  const monitor = state.get('monitor')
  return {
    wallet: wallet,
    account: session.account,
    profile: session.profile,
    networkName: networkService.getName(),
    isTokensLoaded: !wallet.isFetching(),
    tokens: state.get(DUCK_TOKENS),
    networkStatus: monitor.network,
    syncStatus: monitor.sync,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleProfileEdit: (data) => dispatch(modalsOpen({
      component: UpdateProfileDialog,
      data,
    })),
    handleLogout: () => dispatch(logout()),
    handleProfileClose: (panelKey) => {
      dispatch(sidesClose(panelKey))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class ProfileSidePanel extends PureComponent {

  static propTypes = {
    networkName: PropTypes.string,
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
    networkStatus: PropTypes.object,
    syncStatus: PropTypes.object,
    wallet: PropTypes.object,

    handleLogout: PropTypes.func,
    handleProfileEdit: PropTypes.func,
    handleDrawerToggle: PropTypes.func,
    readNotices: PropTypes.func,
    handleProfileClose: PropTypes.func,
  }

  renderProfile () {

    const addressesInWallet = this.props.wallet.addresses()
    const addresses = [
      { title: 'BTC', address: addressesInWallet.item('Bitcoin').address() },
      { title: 'BTG', address: addressesInWallet.item('Bitcoin Gold').address() },
      { title: 'ETH', address: addressesInWallet.item('Ethereum').address() },
      { title: 'NEM', address: addressesInWallet.item('NEM').address() },
    ]

    return (
      <div styleName='profile'>

        <div styleName='close-icon' onTouchTap={() => this.props.handleProfileClose(PROFILE_SIDE_PANEL_KEY)}>
          <FontIcon color='white' className='material-icons'>clear</FontIcon>
        </div>

        <div styleName='network-name'>
          <div styleName='network-name-text'>
            {this.props.networkName}
          </div>
        </div>

        <div styleName='account-info'>
          <div styleName='account-info-avatar'>
            <div styleName='avatar-icon'>
              <IPFSImage
                styleName='avatar-icon-content'
                multihash={this.props.profile.icon()}
                icon={
                  <FontIcon
                    style={{ fontSize: 60, cursor: 'default' }}
                    color='white'
                    className='material-icons'
                  >account_circle
                  </FontIcon>
                }
              />
            </div>
          </div>
          <div styleName='account-info-name'>
            <div styleName='account-name-text'>
              {this.props.profile.name() || 'Account name'}
            </div>
          </div>
          <div styleName='account-info-setting' onTouchTap={this.props.handleProfileEdit}>
            <FontIcon color='white' className='material-icons'>settings</FontIcon>
          </div>
          <div styleName='account-info-setting' onTouchTap={this.props.handleLogout}>
            <FontIcon color='white' className='material-icons'>power_settings_new</FontIcon>
          </div>
        </div>

        <div styleName='main-address'>
          <div styleName='main-address-account'>
            <p styleName='main-address-header-text'>Main address</p>
            <span styleName='main-address-account-name'>{this.props.account}</span>
          </div>
          <div styleName='address-qr-code'>
            <QRIcon iconStyle='average' value={this.props.account} />
          </div>
          <div styleName='address-copy-icon'>
            <CopyIcon iconStyle='average' value={this.props.account} />
          </div>
          <div styleName='address-copy-icon'>
            <PKIcon iconStyle='average' symbol='ETH' />
          </div>
        </div>

        {this.props.tokens
          .filter((token) => addresses.map((a) => a.title.toUpperCase()).includes(token.symbol().toUpperCase()))
          .map((token) => {
            const tokenAddress = addresses.find((e) => e.title === token.symbol().toUpperCase()).address
            return (
              <div styleName='address' key={token.id()}>
                <div styleName='address-token'>
                  <IPFSImage
                    styleName='address-token-icon'
                    fallback={TOKEN_ICONS[ token.symbol() ]}
                  />
                </div>
                <div styleName='address-token-info'>
                  <p styleName='address-info-text'>{token.symbol()} Address</p>
                  <span styleName='main-address-account-name'>{ tokenAddress }</span>
                </div>
                <div styleName='address-qr-code'>
                  <QRIcon iconStyle='average' value={tokenAddress} />
                </div>
                <div styleName='address-copy-icon'>
                  <CopyIcon iconStyle='average' value={tokenAddress} />
                </div>
                <div styleName='address-copy-icon'>
                  <PKIcon iconStyle='average' symbol={token.symbol()} />
                </div>
              </div>
            )
          })
        }

        <div styleName='address-split-hr' />

        <div styleName='profile-fee-slider'>
          <GasSlider />
        </div>
      </div>
    )
  }

  render () {
    return (
      <Drawer
        openSecondary
        open
        width={380}
      >
        {this.renderProfile()}
      </Drawer>
    )
  }
}

export default ProfileSidePanel
