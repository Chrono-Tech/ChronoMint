import { TOKEN_ICONS } from 'assets'
import classnames from 'classnames'
import { IPFSImage, TokenValue } from 'components'
import { Paper } from 'material-ui'
import Amount from 'models/Amount'
import TokenModel from 'models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import './TokenItem.scss'

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
              <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[symbol]} />
              <div styleName='symbol'>{symbol}</div>
            </div>
            <div styleName='info'>
              <div styleName='balance'><Translate value='layouts.partials.InfoPartial.balance' />:</div>
              <TokenValue value={balance} />
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}
