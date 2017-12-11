import TokenModel from 'models/tokens/TokenModel'
import IconBitcoinCashSVG from 'assets/img/icn-bitcoin-cash.svg'
import IconBitcoinSVG from 'assets/img/icn-bitcoin.svg'
import IconEthereumSVG from 'assets/img/icn-ethereum.svg'
import IconTimeSVG from 'assets/img/icn-time.svg'
import classnames from 'classnames'
import { IPFSImage, TokenValue } from 'components'
import { Paper } from 'material-ui'
import Amount from 'models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import './TokenItem.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: IconEthereumSVG,
  BTC: IconBitcoinSVG,
  BCC: IconBitcoinCashSVG,
  TIME: IconTimeSVG,
}

export default class TokenItem extends PureComponent {
  static propTypes = {
    token: PropTypes.instanceOf(TokenModel),
    onClick: PropTypes.func,
    balance: PropTypes.instanceOf(Amount),
    isSelected: PropTypes.bool,
  }

  handleClick = () => this.props.onClick(this.props.token.symbol())

  render () {
    const { token, isSelected, balance } = this.props
    const symbol = token.symbol()

    return (
      <div
        styleName={classnames('root', { selected: isSelected })}
        onTouchTap={this.handleClick}
      >
        <Paper zDepth={1} style={{ background: 'transparent' }}>
          <div styleName='content'>
            <div styleName='icon'>
              <IPFSImage styleName='image' multihash={token.icon()} fallback={ICON_OVERRIDES[symbol]} />
              <div styleName='symbol'>{symbol}</div>
            </div>
            <div styleName='info'>
              <div styleName='balance'><Translate value='layouts.partials.InfoPartial.balance' />:</div>
              <TokenValue
                value={balance}
                symbol={symbol}
              />
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}
