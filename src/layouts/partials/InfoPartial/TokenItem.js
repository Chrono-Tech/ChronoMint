import TokenModel from 'models/tokens/TokenModel'
import classnames from 'classnames'
import { IPFSImage, TokenValue } from 'components'
import { Paper } from 'material-ui'
import Amount from 'models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import './TokenItem.scss'
import tokenIcons from 'components/tokenIcons'

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
              <IPFSImage styleName='image' multihash={token.icon()} fallback={tokenIcons[symbol]} />
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
