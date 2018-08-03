/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import Amount from '@chronobank/core/models/Amount'
import { Link } from 'react-router'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { TIME } from '@chronobank/core/dao/constants'
import { getDeposit } from '@chronobank/core/redux/mainWallet/selectors'
import { Button, IPFSImage, TokenValue } from 'components'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { TOKEN_ICONS } from 'assets'
import { prefix } from './lang'
import './DepositsList.scss'

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  return {
    deposit: getDeposit(TIME)(state),
    token: tokens.item(TIME),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositsList extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    onAddDeposit: PropTypes.func,
    onWithdrawDeposit: PropTypes.func,
  }

  handleAddDeposit = () => {
    this.props.onAddDeposit()
  }

  handleWithdrawDeposit = () => {
    this.props.onWithdrawDeposit()
  }

  render () {
    const { deposit, token } = this.props
    return (
      <div styleName='root'>
        <div styleName='depositItem'>
          <div styleName='iconWrapper'>
            <div styleName='smallIcon' className='chronobank-icon'>deposit</div>
            <div styleName='icon'>
              <IPFSImage
                styleName='iconImg'
                multihash={token.icon()}
                fallback={TOKEN_ICONS[ token.symbol() ]}
              />
            </div>
          </div>
          <div styleName='itemContent'>
            <Link to='/deposit' href styleName='link'>
              <div styleName='title'><Translate value={`${prefix}.deposit`} /></div>
              <div styleName='address'>{token.address()}</div>
              <div styleName='amount'><TokenValue value={deposit} noRenderPrice /></div>
              <div styleName='price'><TokenValue value={deposit} renderOnlyPrice /></div>
            </Link>
            <div styleName='actions'>
              <Button styleName='action' onClick={this.handleWithdrawDeposit}><Translate value={`${prefix}.withdraw`} /></Button>
              <Button styleName='action' onClick={this.handleAddDeposit}><Translate value={`${prefix}.deposit`} /></Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
