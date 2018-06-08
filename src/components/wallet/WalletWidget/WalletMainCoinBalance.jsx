/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { integerWithDelimiter } from 'utils/formatter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { balanceSelector, mainWalletBalanceSelector } from '@chronobank/core/redux/mainWallet/selectors'
import { multisigBalanceSelector, multisigWalletBalanceSelector } from '@chronobank/core/redux/multisigWallet/selectors'
import { getMainSymbolForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import './WalletWidget.scss'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  const mainSymbol = getMainSymbolForBlockchain(wallet.blockchain)
  let getAmount
  let getBalance
  if (wallet.isMain) {
    getAmount = balanceSelector(wallet.blockchain, mainSymbol)
    getBalance = mainWalletBalanceSelector(wallet.blockchain, mainSymbol)
  } else {
    getAmount = multisigBalanceSelector(wallet.address, mainSymbol)
    getBalance = multisigWalletBalanceSelector(wallet.address, mainSymbol)
  }
  const mapStateToProps = (ownState) => {
    const { selectedCurrency } = getMarket(ownState)
    return {
      mainSymbol,
      amountCurrency: getAmount(ownState),
      balance: getBalance(ownState),
      selectedCurrency,
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletMainCoinBalance extends PureComponent {
  static propTypes = {
    mainSymbol: PropTypes.string,
    amountCurrency: PropTypes.number,
    balance: PropTypes.number,
    selectedCurrency: PropTypes.string,
    wallet: PTWallet,
  }

  render () {
    const { selectedCurrency, mainSymbol, amountCurrency, balance } = this.props

    return (
      <div styleName='token-amount' className='WalletMainCoinBalance__root'>
        <div styleName='crypto-amount'>
          {mainSymbol} {balance !== null ? integerWithDelimiter(balance, true, null) : '--'}
        </div>
        <div styleName='usd-amount' className='WalletMainCoinBalance__usd-amount'>
          {selectedCurrency} {integerWithDelimiter(amountCurrency.toFixed(2), true)}
        </div>
      </div>
    )
  }
}
