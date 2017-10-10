import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { IPFSImage, TokenValue } from 'components'
import BigNumber from 'bignumber.js'
import { Translate } from 'react-redux-i18n'
import './PlatformsList.scss'
import { detachPlatform } from 'redux/AssetsManager/actions'

const ICON_OVERRIDES = {
  LHAU: require('assets/img/icn-lhau.svg'),
  LHEU: require('assets/img/icn-lheu.svg'),
  LHUS: require('assets/img/icn-lhus.png'),
}

function prefix (token) {
  return 'Assets.PlatformsList.' + token
}

export class PlatformsList extends Component {
  static propTypes = {
    handleSelectToken: PropTypes.func.isRequired,
    selectedToken: PropTypes.number,
    handleSelectPlatform: PropTypes.func.isRequired,
    selectedPlatform: PropTypes.number,
    platformsList: PropTypes.array,
    detachPlatform: PropTypes.func
  }

  renderTokenList () {
    return (
      <div styleName='tokensList'>

        <div
          styleName={classnames('tokenItem', {'selected': this.props.selectedToken === 1})}
          onTouchTap={() => this.props.handleSelectToken(1)}>
          <div styleName='tokenIcon'>
            <IPFSImage styleName='content' fallback={ICON_OVERRIDES.LHAU} />
          </div>
          <div styleName='tokenTitle'>LHAU</div>
          <div styleName='tokenBalance'>
            <TokenValue
              style={{fontSize: '24px'}}
              value={new BigNumber(1231)}
              symbol={'usd'}
            />
          </div>
        </div>

        <div
          styleName={classnames('tokenItem', {'selected': this.props.selectedToken === 2})}
          onTouchTap={() => this.props.handleSelectToken(2)}>
          <div styleName='tokenIcon'>
            <IPFSImage styleName='content' fallback={ICON_OVERRIDES.LHEU} />
          </div>
          <div styleName='tokenTitle'>LHEU</div>
          <div styleName='tokenBalance'>
            <TokenValue
              style={{fontSize: '24px'}}
              value={new BigNumber(1231)}
              symbol={'usd'}
            />
          </div>
        </div>

        <div
          styleName={classnames('tokenItem', {'selected': this.props.selectedToken === 3})}
          onTouchTap={() => this.props.handleSelectToken(3)}>
          <div styleName='tokenIcon'>
            <IPFSImage styleName='content' fallback={ICON_OVERRIDES.LHUS} />
          </div>
          <div styleName='tokenTitle'>LHUS</div>
          <div styleName='tokenBalance'>
            <TokenValue
              style={{fontSize: '24px'}}
              value={new BigNumber(1231)}
              symbol={'usd'}
            />
          </div>
        </div>

      </div>
    )
  }

  renderPlatformsList () {
    const {selectedPlatform, platformsList, detachPlatform} = this.props
    return (
      <div>
        {
          platformsList.map((platform) => (
            <div styleName='platformWrap' key={platform}>
              <div styleName={classnames('platformHeader', {'selected': selectedPlatform === platform})}>
                <div
                  styleName='platformTitleWrap'
                  onTouchTap={() => this.props.handleSelectPlatform(platform)}>
                  <div styleName='platformIcon' />
                  <div styleName='subTitle'><Translate value={prefix('platform')} /></div>
                  <div styleName='platformTitle'>{platform}</div>
                </div>
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem
                    onTouchTap={() => detachPlatform(platform)}
                    primaryText={<Translate value={prefix('detachPlatform')} />} />
                </IconMenu>
              </div>
              {
                selectedPlatform === platform
                  ? this.renderTokenList(platform)
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
    detachPlatform: (platform) => dispatch(detachPlatform(platform)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatformsList)
