/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import classnames from 'classnames'
import { Button, IPFSImage, TokenValue } from 'components'
import Amount from '@chronobank/core/models/Amount'
import AssetManagerDialog from 'components/assetsManager/AssetManagerDialog/AssetManagerDialog'
import RevokeDialog from 'components/assetsManager/RevokeDialog/RevokeDialog'
import Preloader from 'components/common/Preloader/Preloader'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import {  getFee, getManagersForAssetSymbol } from '@chronobank/core/redux/assetsManager/actions'
import { DUCK_ASSETS_MANAGER } from '@chronobank/core/redux/assetsManager/constants'
import { modalsOpen } from 'redux/modals/actions'
import BlockAssetDialog from 'components/assetsManager/BlockAssetDialog/BlockAssetDialog'
import ReissueAssetForm from 'components/assetsManager/ReissueAssetForm/ReissueAssetForm'
import { getSelectedToken } from '@chronobank/core/redux/assetsManager/selectors'
import BlacklistDialog from 'components/assetsManager/BlacklistDialog/BlacklistDialog'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import tokenIconStubSVG from 'assets/img/asset_stub.svg'
import blockedSVG from 'assets/img/blocked-white.svg'

import './PlatformInfo.scss'

function prefix (token) {
  return `Assets.PlatformInfo.${token}`
}

function mapStateToProps (state) {
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  return {
    selectedToken: getSelectedToken()(state),
    assets: assetsManager.assets(),
    selectedPlatform: assetsManager.selectedPlatform(),
    platformsList: assetsManager.platformsList(),
    usersPlatforms: assetsManager.usersPlatforms(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddManagerDialog: () => dispatch(modalsOpen({
      component: AssetManagerDialog,
    })),
    openBlockAssetDialog: (token) => dispatch(modalsOpen({
      component: BlockAssetDialog,
      props: {
        token,
      },
    })),
    openBlacklistDialog: (token) => dispatch(modalsOpen({
      component: BlacklistDialog,
      props: {
        token,
      },
    })),
    getManagersForAssetSymbol: (symbol) => dispatch(getManagersForAssetSymbol(symbol)),
    getFee: (symbol) => dispatch(getFee(symbol)),
    handleRevokeDialog: () => dispatch(modalsOpen({
      component: RevokeDialog,
    })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PlatformInfo extends PureComponent {
  static propTypes = {
    selectedToken: PropTypes.instanceOf(TokenModel),
    selectedPlatform: PropTypes.string,
    handleAddManagerDialog: PropTypes.func,
    openBlockAssetDialog: PropTypes.func,
    getManagersForAssetSymbol: PropTypes.func,
    reissueAsset: PropTypes.func,
    handleRevokeDialog: PropTypes.func,
    getFee: PropTypes.func,
    platformsList: PropTypes.arrayOf(PropTypes.object),
    usersPlatforms: PropTypes.arrayOf(PropTypes.object),
    assets: PropTypes.objectOf(PropTypes.object),
    openBlacklistDialog: PropTypes.func,
  }

  handleBlockAssetDialog = () => {
    return this.props.openBlockAssetDialog(this.props.selectedToken)
  }

  handleBlacklistDialog = () => {
    return this.props.openBlacklistDialog(this.props.selectedToken)
  }

  renderInstructions () {
    const { selectedToken, selectedPlatform, usersPlatforms, platformsList } = this.props
    if (!usersPlatforms.length && !platformsList.length) {
      return (
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='instructionCreatePlatform'>
              <Translate value={prefix('createPlatform')} />
            </div>
          </div>
        </div>
      )
    }

    if (usersPlatforms.length && !platformsList.length) {
      return (
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='instructionCreatePlatform'>
              <Translate value={prefix('createToken')} />
            </div>
          </div>
        </div>
      )
    }

    if (!selectedPlatform) {
      return (
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='instructionPlatform'>
              <Translate value={prefix('selectPlatform')} />
            </div>
          </div>
        </div>
      )
    }

    if (!selectedToken.isFetched()) {
      return (
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='instructionToken'>
              <Translate value={prefix('selectToken')} />
            </div>
          </div>
        </div>
      )
    }
  }

  renderManagers (managersList) {
    return (
      <div styleName='managersRow'>
        {!managersList.isFetching() && managersList.isFetched()
          ? (
            <div>
              <div styleName='title'>
                <Translate value={prefix('managers')} />
              </div>
              <div styleName='addManager'>
                <button onClick={this.props.handleAddManagerDialog} styleName='addManagerButton'>
                  <span>
                    <Translate value={prefix('manageButton')} size={managersList.size()} />
                  </span>
                </button>
              </div>
            </div>
          )
          : <div styleName='avatarsPreLoader'><Preloader /></div>
        }
      </div>

    )
  }

  renderBlacklist (blacklist) {
    return (
      <div styleName='blacklistRow'>
        {!blacklist.isFetching() && blacklist.isFetched()
          ? (
            <div>
              <div styleName='title'>
                <Translate value={prefix('blacklist')} />
              </div>
              <div styleName='blacklistButtonWrap'>
                <button onClick={this.handleBlacklistDialog} styleName='blacklistButton'>
                  <span>
                    <Translate value={prefix('manageButton')} size={blacklist.list().size} />
                  </span>
                </button>
              </div>
            </div>
          )
          : <div styleName='avatarsPreLoader'><Preloader /></div>
        }
      </div>
    )
  }

  renderFee () {
    const { selectedToken } = this.props
    let value
    switch (selectedToken.withFee()) {
      case true:
        value = <span>{selectedToken.fee().fee().toString()}<span>%</span></span>
        break
      case false:
        value = <Translate value={prefix('withoutFee')} />
        break
      default:
        value = <div styleName='preloader'><Preloader /></div>
    }
    return (
      <div styleName='fee'>
        <div styleName='title'><Translate value={prefix('fee')} />:</div>
        <div styleName='value'>
          {value}
        </div>
      </div>
    )
  }

  render () {
    const { selectedToken, selectedPlatform } = this.props
    if (!selectedPlatform || !selectedToken.isFetched()) {
      return this.renderInstructions()
    }

    const totalSupply = this.props.assets[selectedToken.address()].totalSupply
    const isPaused = selectedToken.isPaused()

    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='balanceRow'>
            <div styleName='iconWrap'>
              <IPFSImage styleName='tokenIcon' multihash={selectedToken.icon()} fallback={tokenIconStubSVG} />
              {selectedToken.isPaused().value() && <span styleName='blockedIcon'><img src={blockedSVG} alt='' /></span>}
            </div>
            <div styleName='dataWrap'>
              <div styleName='title'>{selectedToken.symbol()}</div>
              <div styleName='addressTitle'>{selectedToken.address()}</div>
              <div styleName='balanceWrap'>
                <div styleName='balance'>
                  <div styleName='title'><Translate value={prefix('issuedAmount')} />:</div>
                  <TokenValue
                    style={{ fontSize: '24px' }}
                    value={new Amount(totalSupply, selectedToken.symbol())}
                  />
                </div>
                {this.renderFee()}
              </div>
            </div>
          </div>

          {selectedToken.isReissuable().isFetched() && selectedToken.isReissuable().value() && <ReissueAssetForm />}

          <div styleName='flexRow'>
            {this.renderManagers(selectedToken.managersList())}

            {this.renderBlacklist(selectedToken.blacklist())}
          </div>

          <div styleName='actions'>
            <Button
              disabled={isPaused.isFetching() || !isPaused.isFetched()}
              styleName={classnames('action', { 'block': !selectedToken.isPaused().value() })}
              onClick={this.handleBlockAssetDialog}
              label={isPaused.isFetching() || !isPaused.isFetched()
                ? <Preloader />
                : <Translate value={prefix(selectedToken.isPaused().value() ? 'unblockAsset' : 'blockAsset')} />
              }
            />

            <Button
              onClick={this.props.handleRevokeDialog}
              label={<Translate value={prefix('revoke')} />}
              styleName='action'
            />
          </div>
        </div>
      </div>
    )
  }
}
