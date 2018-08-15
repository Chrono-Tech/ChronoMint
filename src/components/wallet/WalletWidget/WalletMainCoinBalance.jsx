/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { integerWithDelimiter } from '@chronobank/core-dependencies/utils/formatter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getMainSymbolForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import { walletAmountSelector, walletBalanceSelector } from '@chronobank/core/redux/wallets/selectors/balances'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import './WalletWidget.scss'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  const mainSymbol = getMainSymbolForBlockchain(wallet.blockchain)
  let getAmount
  let getBalance
  getAmount = walletAmountSelector(wallet.id, mainSymbol)
  getBalance = walletBalanceSelector(wallet.id, mainSymbol)
  const mapStateToProps = (ownState) => {
    const { selectedCurrency } = getMarket(ownState)
    return {
      mainSymbol,
      balance: getBalance(ownState),
      amount: getAmount(ownState),
      selectedCurrency,
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletMainCoinBalance extends PureComponent {
  static propTypes = {
    mainSymbol: PropTypes.string,
    balance: PropTypes.number,
    amount: PropTypes.number,
    selectedCurrency: PropTypes.string,
    wallet: PTWallet,
  }

  render () {
    const { selectedCurrency, mainSymbol, balance, amount } = this.props

    return (
      <div styleName='token-amount' className='WalletMainCoinBalance__root'>
        <div styleName='crypto-amount'>
          {mainSymbol} {amount !== null ? integerWithDelimiter(amount, true, null) : '--'}
        </div>
        <div styleName='usd-amount' className='WalletMainCoinBalance__usd-amount'>
          {selectedCurrency} {integerWithDelimiter(balance.toFixed(2), true)}
        </div>
      </div>
    )
  }
}
