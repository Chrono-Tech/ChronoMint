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
    selectedToken: PropTypes.number
  }

  constructor (props) {
    super(props)

    this.state = {
      selectedPlatform: null
    }
  }

  handleSelectPlatform (platformId) {
    this.setState({selectedPlatform: this.state.selectedPlatform === platformId ? null : platformId})
    this.props.handleSelectToken(null)
  }

  render () {
    const {selectedPlatform} = this.state
    return (
      <div styleName='root'>
        <div styleName='content'>

          <div styleName='platformWrap' key={1}>
            <div styleName={classnames('platformHeader', {'selected': selectedPlatform === 1})}>
              <div
                styleName='platformTitle'
                onTouchTap={() => this.handleSelectPlatform(1)}>
                <div styleName='platformIcon' />
                <div styleName='subTitle'><Translate value={prefix('platform')} /></div>
                0x9876f6477iocc4757q22dfg3333nmk1111v234x0
              </div>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem primaryText='Refresh' />
                <MenuItem primaryText='Send feedback' />
                <MenuItem primaryText='Settings' />
                <MenuItem primaryText='Help' />
                <MenuItem primaryText='Sign out' />
              </IconMenu>
            </div>
            {
              selectedPlatform === 1
                ? <div styleName='tokensList'>

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
                : null
            }
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps (/*state*/) {
  return {}
}

function mapDispatchToProps (/*dispatch*/) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatformsList)
