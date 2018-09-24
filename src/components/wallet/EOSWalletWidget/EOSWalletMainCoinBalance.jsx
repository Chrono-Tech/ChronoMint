/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { EOS } from '@chronobank/core/redux/eos/constants'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import { EOSWalletAmountSelector, EOSWalletBalanceSelector } from '@chronobank/core/redux/eos/selectors/balances'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import './EOSWalletWidget.scss'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  const mainSymbol = EOS
  let getAmount
  let getBalance
  getAmount = EOSWalletAmountSelector(wallet.id, mainSymbol)
  getBalance = EOSWalletBalanceSelector(wallet.id, mainSymbol)
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
export default class EOSWalletMainCoinBalance extends PureComponent {
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
