import { connect } from "react-redux"
import PropTypes from "prop-types"
import { TOKEN_ICONS } from 'assets'
import { sidesPush } from 'redux/sides/actions'
import ProfileModel from 'models/ProfileModel'
import { default as SidePanel, SIDE_PANEL_KEY } from 'layouts/partials/SidePanel/SidePanel'
import networkService from '@chronobank/login/network/NetworkService'
import React, { PureComponent } from 'react'
import { logout } from 'redux/session/actions'
import { getProfileTokensList } from 'redux/session/selectors'
import {  FontIcon } from 'material-ui'
import { modalsOpen } from 'redux/modals/actions'
import { IPFSImage, QRIcon, PKIcon, CopyIcon, UpdateProfileDialog } from 'components'

import GasSlider from 'components/common/GasSlider/GasSlider'

import './ProfileContent.scss'

function mapStateToProps (state) {
  const session = state.get('session')
  return {
    account: session.account,
    profile: session.profile,
    networkName: networkService.getName(),
    tokens: getProfileTokensList()(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleProfileEdit: (data) => dispatch(modalsOpen({
      component: UpdateProfileDialog,
      data,
    })),
    handleLogout: () => dispatch(logout()),
    handleProfileClose: () => {
      dispatch(sidesPush({
        component: SidePanel,
        key: SIDE_PANEL_KEY,
        props: { isOpened: false },
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class ProfileContent extends PureComponent {

  static propTypes = {
    isOpened: PropTypes.bool,
    networkName: PropTypes.string,
    account: PropTypes.string,
    profile: PropTypes.instanceOf(ProfileModel),
    tokens: PropTypes.arrayOf(PropTypes.object),

    handleLogout: PropTypes.func,
    handleProfileEdit: PropTypes.func,
    handleDrawerToggle: PropTypes.func,
    handleProfileClose: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = { isReadyToClose: true }
  }

  // Due to material-ui bug. Immediate close on mobile devices.
  // @see https://github.com/mui-org/material-ui/issues/6634
  // Going to be fixed in 1.00 version.
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isOpened && !this.props.isOpened) {
      this.setState({ isReadyToClose: false }, () => {
        setTimeout(() => {
          this.setState({ isReadyToClose: true })
        }, 300)
      })
    }
  }

  handleProfileClose = () => {
    if (!this.state.isReadyToClose) {
      return
    }
    this.props.handleProfileClose()
  }

  render () {
    return (
      <div styleName='profile'>

        <div styleName='close-icon' onTouchTap={this.handleProfileClose}>
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
          <div styleName='account-info-icons'>
            <div styleName='account-info-setting' onTouchTap={this.props.handleProfileEdit}>
              <FontIcon color='white' className='material-icons'>settings</FontIcon>
            </div>
            <div styleName='account-info-setting' onTouchTap={this.props.handleLogout}>
              <FontIcon color='white' className='material-icons'>power_settings_new</FontIcon>
            </div>
          </div>
        </div>

        <div styleName='main-address'>
          <div styleName='main-address-account'>
            <div styleName='main-address-header-text'>Main address</div>
            <div styleName='main-address-account-name'>
              <span styleName='main-address-account-name-text'>
                {this.props.account}
              </span>
            </div>
          </div>
          <div styleName='main-address-icons'>
            <div styleName='address-qr-code'>
              <QRIcon iconStyle='average' value={this.props.account} />
            </div>
            <div styleName='address-copy-icon'>
              <CopyIcon iconStyle='average' value={this.props.account} />
            </div>
            <div styleName='address-pk-icon'>
              <PKIcon iconStyle='average' blockchain='Ethereum' />
            </div>
          </div>
        </div>

        {this.props.tokens
          .map((token) => {
            return (
              <div styleName='address' key={token.blockchain}>
                <div styleName='address-info'>
                  <div styleName='address-token'>
                    <IPFSImage
                      styleName='address-token-icon'
                      fallback={TOKEN_ICONS[ token.symbol ]}
                    />
                  </div>
                  <div styleName='address-token-info'>
                    <div styleName='address-info-text'>{token.title} Address</div>
                    <div styleName='address-token-name'>
                      <span styleName='address-token-name-text'>
                        { token.address }
                      </span>
                    </div>
                  </div>
                </div>
                <div styleName='address-icons'>
                  <div styleName='address-qr-code'>
                    <QRIcon iconStyle='average' value={token.address} />
                  </div>
                  <div styleName='address-copy-icon'>
                    <CopyIcon iconStyle='average' value={token.address} />
                  </div>
                  <div styleName='address-pk-icon'>
                    <PKIcon iconStyle='average' blockchain={token.blockchain} />
                  </div>
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
}

export default ProfileContent
