/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import TokenValue from 'components/common/TokenValue/TokenValue'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { detachPlatform, selectPlatform, selectToken } from '@chronobank/core/redux/assetsManager/actions'
import { DUCK_ASSETS_MANAGER } from '@chronobank/core/redux/assetsManager/constants'
import Preloader from 'components/common/Preloader/Preloader'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import Amount from '@chronobank/core/models/Amount'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import WithLoader from 'components/common/Preloader/WithLoader'
import blockedSVG from 'assets/img/blocked-white.svg'
import tokenIconStubSVG from 'assets/img/asset_stub.svg'

import './PlatformsList.scss'

function prefix (token) {
  return `Assets.PlatformsList.${token}`
}

function mapStateToProps (state) {
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  const tokens = state.get(DUCK_TOKENS)
  const platformList = assetsManager.platformsList()

  return {
    platformsList: platformList,
    tokens,
    assets: assetsManager.assets(),
    selectedToken: assetsManager.selectedToken(),
    selectedPlatform: assetsManager.selectedPlatform(),
    assetsManagerCountsLoading: assetsManager.isFetching() && !assetsManager.isFetched(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSelectPlatform: (platformAddress) => dispatch(selectPlatform(platformAddress)),
    onSelectToken: (token: TokenModel) => dispatch(selectToken(token)),
    onDetachPlatform: (platformAddress) => dispatch(detachPlatform(platformAddress)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PlatformsList extends PureComponent {
  static propTypes = {
    onSelectToken: PropTypes.func.isRequired,
    selectedToken: PropTypes.string,
    onSelectPlatform: PropTypes.func.isRequired,
    selectedPlatform: PropTypes.string,
    onDetachPlatform: PropTypes.func,
    platformsList: PropTypes.arrayOf(PropTypes.object),
    tokens: PropTypes.instanceOf(TokensCollection),
    assets: PropTypes.objectOf(PropTypes.object),
    assetsManagerCountsLoading: PropTypes.bool,
  }

  handleSelectPlatform = (platformAddress) => () => {
    this.props.onSelectPlatform(this.props.selectedPlatform === platformAddress ? null : platformAddress)
  }

  handleSelectToken = (token = {}) => () => {
    try {
      if (token.isPending()) return
      if (!token.isFetched()) return

      return this.props.onSelectToken(token)
    } catch (e) {
      return
    }
  }

  renderTokenList ({ assets, tokens, selectedToken }) {
    const filteredTokens = Object.values(assets)
      .filter((asset) => {
        return asset.platform ? asset.platform === this.props.selectedPlatform : false
      })
    const showTitle = (token: TokenModel, asset) => {
      if (token.isPending()) {
        return <Translate value={prefix('pending')} />
      }
      return token.isFetched() ? <div styleName='addressWrap'>{asset.address}</div> : <Translate value={prefix('loading')} />
    }

    return (
      <div styleName='tokensList'>
        {
          filteredTokens.length === 0 &&
          <div styleName='noTokens'>
            <Translate value={prefix('noTokens')} />
          </div>
        }
        {
          filteredTokens.map((asset) => {
            const token = tokens.getByAddress(asset.address)
            if (!token.symbol()) {
              return null
            }

            return (
              <div
                key={asset.address}
                styleName={classnames('tokenItem', { 'selected': selectedToken !== null && selectedToken === token.symbol() })}
                onClick={this.handleSelectToken(token)}
              >
                <div styleName='tokenIcon'>
                  <IPFSImage styleName='content' multihash={token.icon()} fallback={tokenIconStubSVG} />
                  {token.isPaused().value() && <span styleName='blockedIcon'><img src={blockedSVG} alt='' /></span>}
                </div>
                <div styleName='tokenTitle'>
                  <div styleName='tokenSubTitle'>{token.symbol()}</div>
                </div>
                {showTitle(token, asset)}
                <div styleName='tokenBalance'>
                  {
                    token.isFetched() && asset.totalSupply &&
                    <TokenValue
                      style={{ fontSize: '24px' }}
                      value={new Amount(asset.totalSupply, token.symbol())}
                    />
                  }
                </div>
              </div>
            )
          })
        }

      </div>
    )
  }

  renderPlatformsList = ({ selectedPlatform, platformsList, tokens, selectedToken, assets }) => {
    return (
      <div>
        {
          platformsList.map(({ name, address }) => (
            <div styleName='platformWrap' key={address}>
              <div styleName={classnames('platformHeader', { 'selected': selectedPlatform === address })}>
                <div
                  styleName='platformTitleWrap'
                  onClick={this.handleSelectPlatform(address)}
                >
                  <div styleName='platformIcon' />
                  <div styleName='subTitle'><Translate value={prefix('platform')} /></div>
                  {name
                    ? <div styleName='platformTitle'>{name}&nbsp;( <small>{address}</small> )</div>
                    : <div styleName='platformTitle'>{address}</div>
                  }
                </div>
              </div>
              {selectedPlatform === address && this.renderTokenList({ assets, tokens, selectedToken })}
            </div>
          ))
        }
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <WithLoader
            showLoader={this.props.assetsManagerCountsLoading}
            loader={<div styleName='preloaderWrap'><Preloader /></div>}
            selectedPlatform={this.props.selectedPlatform}
            platformsList={this.props.platformsList}
            tokens={this.props.tokens}
            selectedToken={this.props.selectedToken}
            onDetachPlatform={this.props.onDetachPlatform}
            assets={this.props.assets}
          >
            {this.renderPlatformsList}
          </WithLoader>
        </div>
      </div>
    )
  }
}
