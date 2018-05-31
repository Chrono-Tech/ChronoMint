/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import Amount from 'models/Amount'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_MAIN_WALLET, getTransactionsForWallet, TIME } from 'redux/mainWallet/actions'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import MainWalletModel from 'models/wallet/MainWalletModel'
import { DUCK_SESSION } from 'redux/session/actions'
import { getDeposit } from 'redux/mainWallet/selectors'
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
  const wallet = state.get(DUCK_MAIN_WALLET)
  const { account } = state.get(DUCK_SESSION)
  return {
    wallet,
    spender,
    account,
    deposit: getDeposit(TIME)(state),
    token: tokens.item(TIME),
    transactions: wallet.transactions({ blockchain: BLOCKCHAIN_ETHEREUM, address: spender }),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addDeposit: (props) => dispatch(modalsOpen({ component: DepositTokensModal, props })),
    getTransactions: (params) => dispatch(getTransactionsForWallet(params)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Deposit extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MainWalletModel),
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
    const { wallet, spender } = this.props
    this.props.getTransactions({ wallet, address: spender, blockchain: BLOCKCHAIN_ETHEREUM })
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
                <Button styleName='action' onTouchTap={this.handleWithdrawDeposit}><Translate value={`${prefix}.withdraw`} /></Button>
                <Button styleName='action' onTouchTap={this.handleAddDeposit}><Translate value={`${prefix}.deposit`} /></Button>
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
