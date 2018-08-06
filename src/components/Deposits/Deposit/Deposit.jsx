/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import Amount from '@chronobank/core/models/Amount'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { TIME, BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { getDeposit } from '@chronobank/core/redux/mainWallet/selectors'
import { Button, IPFSImage, TokenValue } from 'components'
import { modalsOpen } from 'redux/modals/actions'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { TOKEN_ICONS } from 'assets'
import { DUCK_ASSETS_HOLDER } from '@chronobank/core/redux/assetsHolder/constants'
import TransactionsTable from 'components/dashboard/TransactionsTable/TransactionsTable'
import TransactionsCollection from '@chronobank/core/models/wallet/TransactionsCollection'
import { getWallet } from '@chronobank/core/redux/wallets/selectors/models'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import { formatDataAndGetTransactionsForWallet } from '@chronobank/core/redux/wallet/actions'

import { prefix } from './lang'
import './Deposit.scss'

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const spender = assetHolder.wallet()
  const wallet = getWallet(state)
  const { account } = state.get(DUCK_SESSION)
  return {
    wallet,
    spender,
    account,
    deposit: getDeposit(TIME)(state),
    token: tokens.item(TIME),
    transactions: wallet.transactions.transactions,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addDeposit: (props) => dispatch(modalsOpen({ component: DepositTokensModal, props })),
    getTransactions: (params) => dispatch(formatDataAndGetTransactionsForWallet(params)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Deposit extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(WalletModel),
    deposit: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    transactions: PropTypes.instanceOf(TransactionsCollection),
    spender: PropTypes.string,
    addDeposit: PropTypes.func,
    getTransactions: PropTypes.func,
    onWithdrawDeposit: PropTypes.func,
    account: PropTypes.string,
  }

  componentDidMount () {
    this.handleGetTransactions()
  }

  handleGetTransactions = () => {
    const { wallet } = this.props
    this.props.getTransactions({ wallet })
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
                  fallback={TOKEN_ICONS[token.symbol()]}
                />
              </div>
            </div>
            <div styleName='itemContent'>
              <div styleName='title'><Translate value={`${prefix}.title`} /></div>
              <div styleName='address'>{spender}</div>
              <div styleName='amount'><TokenValue value={deposit} noRenderPrice /></div>
              <div styleName='price'><TokenValue value={deposit} renderOnlyPrice /></div>
              <div styleName='actions'>
                <Button styleName='action' onClick={this.handleWithdrawDeposit}><Translate value={`${prefix}.withdraw`} /></Button>
                <Button styleName='action' onClick={this.handleAddDeposit}><Translate value={`${prefix}.deposit`} /></Button>
              </div>
            </div>
          </div>
          <div styleName='transactions'>
            <TransactionsTable transactions={transactions} walletAddress={spender} blockchain={BLOCKCHAIN_ETHEREUM} onGetTransactions={this.handleGetTransactions} />
          </div>
        </div>
      </div>
    )
  }
}
