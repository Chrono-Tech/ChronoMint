import { detachPlatform } from 'redux/assetsManager/actions'
import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatButton } from 'material-ui'
import { IPFSImage, TokenValue } from 'components'
import BigNumber from 'bignumber.js'
import { Translate } from 'react-redux-i18n'
import './PlatformsList.scss'

function prefix (token) {
  return `Assets.PlatformsList.${token}`
}

export class PlatformsList extends Component {
  static propTypes = {
    handleSelectToken: PropTypes.func.isRequired,
    selectedToken: PropTypes.object,
    handleSelectPlatform: PropTypes.func.isRequired,
    selectedPlatform: PropTypes.string,
    platformsList: PropTypes.array,
    detachPlatform: PropTypes.func,
    tokensMap: PropTypes.object,
    assets: PropTypes.object
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
                styleName={classnames('tokenItem', {'selected': this.props.selectedToken && this.props.selectedToken.address() === token.address()})}
                onTouchTap={() => this.props.handleSelectToken(token)}
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
                  onTouchTap={() => this.props.handleSelectPlatform(address)}
                >
                  <div styleName='platformIcon' />
                  <div styleName='subTitle'><Translate value={prefix('platform')} /></div>
                  <div styleName='platformTitle'>{name}&nbsp;(
                    <small>{address}</small>
                    )
                  </div>
                </div>
                <div styleName='platformActions'>
                  <FlatButton
                    label={<Translate value={prefix('detachPlatform')} />}
                    onTouchTap={() => detachPlatform(address)}
                  />
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

function mapStateToProps (/*state*/) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    detachPlatform: platform => dispatch(detachPlatform(platform))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatformsList)
