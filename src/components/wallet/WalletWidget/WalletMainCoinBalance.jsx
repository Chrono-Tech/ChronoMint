/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getMainSymbolForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import { walletAmountSelector, walletBalanceSelector } from '@chronobank/core/redux/wallets/selectors/balances'
import { selectCurrentCurrency } from '@chronobank/market/redux/selectors'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import { formatDataAndGetTransactionsForWallet } from '@chronobank/core/redux/wallet/actions'
import './WalletWidget.scss'

function makeMapStateToProps(state, props) {
  const { wallet } = props
  const mainSymbol = getMainSymbolForBlockchain(wallet.blockchain)
  const getAmount = walletAmountSelector(wallet.id, mainSymbol)
  const getBalance = walletBalanceSelector(wallet.id, mainSymbol)
  return (ownState) => {
    const selectedCurrency = selectCurrentCurrency(ownState)
    return {
      wallet,
      mainSymbol,
      balance: getBalance(ownState),
      amount: getAmount(ownState),
      selectedCurrency,
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getTransactions: (params) => dispatch(formatDataAndGetTransactionsForWallet(params)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class WalletMainCoinBalance extends PureComponent {
  static propTypes = {
    mainSymbol: PropTypes.string,
    balance: PropTypes.number,
    amount: PropTypes.number,
    selectedCurrency: PropTypes.string,
    wallet: PTWallet,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.balance !== nextProps.balance) {
      this.props.getTransactions({
        wallet: nextProps.wallet,
        address: nextProps.wallet.address,
        blockchain: nextProps.wallet.blockchain,
        forcedOffset: true,
      })
    }

  }

  render() {
    const { selectedCurrency, mainSymbol, balance, amount } = this.props

    return (
      <div styleName='token-amount' className='WalletMainCoinBalance__root'>
        <div styleName='crypto-amount'>
          {mainSymbol} {amount !== null ? integerWithDelimiter(amount, true, 2) : '--'}
        </div>
        <div styleName='usd-amount' className='WalletMainCoinBalance__usd-amount'>
          {selectedCurrency} {integerWithDelimiter(balance.toFixed(2), true)}
        </div>
      </div>
    )
  }
}
