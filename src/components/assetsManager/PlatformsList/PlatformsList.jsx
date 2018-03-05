import { IPFSImage, TokenValue } from 'components'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { DUCK_ASSETS_MANAGER, SELECT_PLATFORM, selectToken } from 'redux/assetsManager/actions'
import Preloader from 'components/common/Preloader/Preloader'
import TokenModel from 'models/tokens/TokenModel'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import Amount from 'models/Amount'
import TokensCollection from 'models/tokens/TokensCollection'
import WithLoader from 'components/common/Preloader/WithLoader'

import './PlatformsList.scss'

function prefix (token) {
  return `Assets.PlatformsList.${token}`
}

class PlatformsList extends PureComponent {
  static propTypes = {
    handleSelectToken: PropTypes.func.isRequired,
    selectedToken: PropTypes.string,
    handleSelectPlatform: PropTypes.func.isRequired,
    selectedPlatform: PropTypes.string,
    platformsList: PropTypes.array,
    tokens: PropTypes.instanceOf(TokensCollection),
    assets: PropTypes.object,
    assetsManagerCountsLoading: PropTypes.bool,
  }

  handleSelectPlatform (platformAddress) {
    this.props.handleSelectPlatform(this.props.selectedPlatform === platformAddress ? null : platformAddress)
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
                onTouchTap={() => !token.isPending() && token.isFetched() && this.props.handleSelectToken(token)}
              >
                <div styleName='tokenIcon'>
                  <IPFSImage styleName='content' multihash={token.icon()} />
                </div>
                <div styleName='tokenTitle'>
                  <div styleName='tokenSubTitle'>{token.symbol()}</div>
                </div>
                {showTitle(token, asset)}
                <div styleName='tokenBalance'>
                  {
                    token.isFetched() &&
                    <TokenValue
                      style={{ fontSize: '24px' }}
                      value={new Amount(token ? asset.totalSupply : asset.totalSupply, token.symbol())}
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
                  onTouchTap={() => this.handleSelectPlatform(address)}
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
            assets={this.props.assets}
          >
            {this.renderPlatformsList}
          </WithLoader>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  const tokens = state.get(DUCK_TOKENS)
  return {
    platformsList: assetsManager.platformsList,
    tokens,
    assets: assetsManager.assets,
    selectedToken: assetsManager.selectedToken,
    selectedPlatform: assetsManager.selectedPlatform,
    assetsManagerCountsLoading: assetsManager.assetsManagerCountsLoading,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleSelectPlatform: (platformAddress) => {
      dispatch({ type: SELECT_PLATFORM, payload: { platformAddress } })
    },
    handleSelectToken: (token: TokenModel) => dispatch(selectToken(token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatformsList)
