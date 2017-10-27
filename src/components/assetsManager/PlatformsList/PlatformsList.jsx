import React, {Component} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {IPFSImage, TokenValue} from 'components'
import BigNumber from 'bignumber.js'
import {Translate} from 'react-redux-i18n'
import './PlatformsList.scss'
import {SELECT_PLATFORM, SELECT_TOKEN} from 'redux/assetsManager/actions'

function prefix (token) {
  return `Assets.PlatformsList.${token}`
}

export class PlatformsList extends Component {
  static propTypes = {
    handleSelectToken: PropTypes.func.isRequired,
    selectedToken: PropTypes.string,
    handleSelectPlatform: PropTypes.func.isRequired,
    selectedPlatform: PropTypes.string,
    platformsList: PropTypes.array,
    tokensMap: PropTypes.object,
    assets: PropTypes.object,
  }

  handleSelectPlatform (platformAddress) {
    this.props.handleSelectPlatform(this.props.selectedPlatform === platformAddress ? null : platformAddress)
  }

  renderTokenList () {
    const filteredTokens = this.props.tokensMap.toArray()
      .filter(token => token.platform() === this.props.selectedPlatform)
    return (
      <div styleName='tokensList'>
        {
          filteredTokens
            .map(token => {
              return (<div
                key={token.address()}
                styleName={classnames('tokenItem', {'selected': this.props.selectedToken === token.symbol()})}
                onTouchTap={() => this.props.handleSelectToken(token.symbol())}
              >
                <div styleName='tokenIcon'>
                  <IPFSImage styleName='content' multihash={token.icon()} />
                </div>
                <div styleName='tokenTitle'>{token.symbol()}</div>
                <div styleName='tokenBalance'>
                  <TokenValue
                    style={{fontSize: '24px'}}
                    value={new BigNumber(this.props.assets[token.address()].totalSupply)}
                    symbol={token.symbol()}
                  />
                </div>
              </div>)
            })
        }

      </div>
    )
  }

  renderPlatformsList () {
    const {selectedPlatform, platformsList, detachPlatform} = this.props
    return (
      <div>
        {
          platformsList.map(({name, address}) => (
            <div styleName='platformWrap' key={address}>
              <div styleName={classnames('platformHeader', {'selected': selectedPlatform === address})}>
                <div
                  styleName='platformTitleWrap'
                  onTouchTap={() => this.handleSelectPlatform(address)}
                >
                  <div styleName='platformIcon' />
                  <div styleName='subTitle'><Translate value={prefix('platform')} /></div>
                  <div styleName='platformTitle'>{name}&nbsp;(
                    <small>{address}</small>
                    )
                  </div>
                </div>
              </div>
              {
                selectedPlatform === address
                  ? this.renderTokenList(address)
                  : null
              }
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

          {this.renderPlatformsList()}

        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const assetsManager = state.get('assetsManager')
  return {
    platformsList: assetsManager.platformsList,
    tokensMap: assetsManager.tokensMap,
    assets: assetsManager.assets,
    selectedToken: assetsManager.selectedToken,
    selectedPlatform: assetsManager.selectedPlatform,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleSelectPlatform: platformAddress => {
      dispatch({type: SELECT_PLATFORM, payload: {platformAddress}})
    },
    handleSelectToken: symbol => dispatch({type: SELECT_TOKEN, payload: {symbol}}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatformsList)
