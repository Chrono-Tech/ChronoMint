/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import Amount from 'models/Amount'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_MAIN_WALLET, TIME } from 'redux/mainWallet/actions'
import { getDeposit } from 'redux/mainWallet/selectors'
import { Button, IPFSImage, TokenValue, TxConfirmations } from 'components'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokenModel from 'models/tokens/TokenModel'
import { TOKEN_ICONS } from 'assets'
import MainWalletModel from 'models/wallet/MainWalletModel'
import { DUCK_ASSETS_HOLDER } from 'redux/assetsHolder/actions'
import TxModel from 'models/TxModel'
import { prefix } from './lang'
import './Deposit.scss'

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  const wallet: MainWalletModel = state.get(DUCK_MAIN_WALLET)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const spender = assetHolder.wallet()
  const transactions = wallet.transactions().items().filter((tx) => {
    return tx.from() === spender || tx.to() === spender
  })
  return {
    spender,
    deposit: getDeposit(TIME)(state),
    token: tokens.item(TIME),
    transactions,
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Deposit extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    transactions: PropTypes.arrayOf(PropTypes.instanceOf(TxModel)),
    spender: PropTypes.string,
  }

  render () {
    const { deposit, token, transactions, spender } = this.props

    return (
      <div styleName='root'>
        <div styleName='depositItem'>
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
              <Button styleName='action'><Translate value={`${prefix}.withdraw`} /></Button>
              <Button styleName='action'><Translate value={`${prefix}.deposit`} /></Button>
            </div>
          </div>
        </div>
        <div>
          {transactions.map(((tx) => (
            <div key={tx.id()}>
              <TxConfirmations transaction={tx} />
            </div>
          )))}
        </div>
      </div>
    )
  }
}
