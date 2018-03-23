import { Link } from 'react-router'
import iconTokenDefaultSVG from 'assets/img/icons/coin-blue.svg'
import React, { PureComponent } from 'react'
import linkSvg from 'assets/img/icons/prev.svg'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import iconSvg from 'assets/img/icons/portfolio-white.svg'
import { getUserTokens } from 'redux/assetsManager/selectors'
import TokenModel from 'models/tokens/TokenModel'
import { IPFSImage } from 'components'
import './MenuAssetsManagerMoreInfo.scss'
import { prefix } from './lang'

function mapStateToProps (state, ownProps) {
  return {
    assets: getUserTokens()(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MenuAssetsManagerMoreInfo extends PureComponent {
  static propTypes = {
    assets: PropTypes.objectOf(PropTypes.object),
  }

  renderPlatform = (platformAddress, key) => {
    const assetsList = this.props.assets[ platformAddress ]
    return (
      <div styleName='walletIrem' key={platformAddress}>
        <Link to='/assets' href styleName='walletTitle'>
          <div styleName='walletName'><Translate value={`${prefix}.assetPlatform`} num={key + 1} /></div>
          <div styleName='walletAddress'>{platformAddress}</div>
          <div styleName='walletLink'>
            <img alt='' src={linkSvg} />
          </div>
        </Link>

        {Object.values(assetsList).map((token: TokenModel) => {
          return (
            <Link to='/assets' href styleName='action' key={token.address()}>
              <div styleName='actionIcon'>
                <IPFSImage multihash={token && token.icon()} fallback={iconTokenDefaultSVG} />
              </div>
              <div styleName='actionTitle'>
                {token.symbol()}
              </div>
            </Link>)
        })}

      </div>
    )
  }

  render () {
    const { assets } = this.props

    return (
      <div styleName='root'>
        <div styleName='content-part'>
          <div styleName='title'>
            <img src={iconSvg} alt='' styleName='tokenIcon' />
            <div styleName='titleText'><Translate value={`${prefix}.title`} /></div>
          </div>

          {Object.keys(assets).map(this.renderPlatform)}
        </div>
      </div>
    )
  }
}
