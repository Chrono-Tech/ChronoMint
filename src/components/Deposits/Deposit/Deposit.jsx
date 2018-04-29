/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import Amount from 'models/Amount'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { TIME } from 'redux/mainWallet/actions'
import { getDeposit, getTxs } from 'redux/mainWallet/selectors'
import { Button, IPFSImage, TokenValue } from 'components'
import { modalsOpen } from 'redux/modals/actions'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokenModel from 'models/tokens/TokenModel'
import { TOKEN_ICONS } from 'assets'
import { DUCK_ASSETS_HOLDER } from 'redux/assetsHolder/actions'
import TransactionsTable from 'components/dashboard/TransactionsTable/TransactionsTable'
import TransactionsCollection from 'models/wallet/TransactionsCollection'

import { prefix } from './lang'
import './Deposit.scss'

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const spender = assetHolder.wallet()
  return {
    spender,
    deposit: getDeposit(TIME)(state),
    token: tokens.item(TIME),
    transactions: getTxs((tx) => {
      return tx.from() === spender || tx.to() === spender
    })(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addDeposit: (props) => dispatch(modalsOpen({ component: DepositTokensModal, props })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Deposit extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    transactions: PropTypes.instanceOf(TransactionsCollection),
    spender: PropTypes.string,
    addDeposit: PropTypes.func,
    onWithdrawDeposit: PropTypes.func,
  }

  handleAddDeposit = () => {
    this.props.addDeposit()
  }

  handleWithdrawDeposit = () => {
    this.props.addDeposit({ isWithdraw: true })
  }

  render () {
    const { deposit, token, transactions, spender } = this.props

    return (
      <div styleName='root'>
        <div styleName='depositItem'>
          <div styleName='mainInfo'>
            <div styleName='iconWrapper'>
              <div styleName='icon'>
                <IPFSImage
                  styleName='iconImg'
                  multihash={token.icon()}
                  fallback={TOKEN_ICONS[ token.symbol() ]}
                />
              </div>
            </div>
            <div styleName='itemContent'>
              <div styleName='title'><Translate value={`${prefix}.title`} /></div>
              <div styleName='address'>{spender}</div>
              <div styleName='amount'><TokenValue value={deposit} noRenderPrice /></div>
              <div styleName='price'><TokenValue value={deposit} renderOnlyPrice /></div>
              <div styleName='actions'>
                <Button styleName='action' onTouchTap={this.handleWithdrawDeposit}><Translate value={`${prefix}.withdraw`} /></Button>
                <Button styleName='action' onTouchTap={this.handleAddDeposit}><Translate value={`${prefix}.deposit`} /></Button>
              </div>
            </div>
          </div>
          <div styleName='transactions'>
            <TransactionsTable transactions={transactions} />
          </div>
        </div>
      </div>
    )
  }
}
