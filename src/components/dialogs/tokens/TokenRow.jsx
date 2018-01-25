import { TOKEN_ICONS } from 'assets'
import classnames from 'classnames'
import { IPFSImage, TokenValue } from 'components'
import WithLoader, { isFetching } from 'components/common/Preloader/WithLoader'
import { Checkbox } from 'material-ui'
import ProfileModel from 'models/ProfileModel'
import BalancesCollection from 'models/tokens/BalancesCollection'
import TokenModel from 'models/tokens/TokenModel'
import PropTypes from 'prop-types'
import { MANDATORY_TOKENS } from 'dao/ERC20ManagerDAO'
import React, { PureComponent } from 'react'
import './TokenRow.scss'

export default class TokenRow extends PureComponent {
  static propTypes = {
    token: PropTypes.instanceOf(TokenModel),
    balances: PropTypes.instanceOf(BalancesCollection),
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    profile: PropTypes.instanceOf(ProfileModel),
  }

  handleClick = () => this.props.onClick(this.props.token, !this.props.isSelected)

  renderCheckbox = ({ isSelected }) => {
    const isMandatory = MANDATORY_TOKENS.includes(this.props.token.symbol())
    return <Checkbox checked={isSelected || isMandatory } disabled={isMandatory} />
  }

  render () {
    const { isSelected, token, balances } = this.props
    const symbol = token.symbol()
    const balance = balances.item(token.id())

    return (
      <div
        key={token.id()}
        styleName={classnames('row', { selected: isSelected })}
        onTouchTap={this.handleClick}
      >
        <div styleName='cell'>
          <div styleName='icon'>
            <IPFSImage styleName='iconContent' multihash={token.icon()} fallback={TOKEN_ICONS[ symbol ]} />
            <div styleName='label'>{symbol}</div>
          </div>
        </div>
        <div styleName='cell cellAuto'>
          <div styleName='symbol'>{symbol}</div>
          <div><TokenValue value={balance.amount()} /></div>
        </div>
        <div styleName='cell'>
          <WithLoader showLoader={isFetching} payload={token} isSelected={this.props.isSelected}>
            {this.renderCheckbox}
          </WithLoader>
        </div>
      </div>
    )
  }
}