/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { getMainSymbolForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import { connect } from 'react-redux'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import { EOSWalletBalanceSelector } from '@chronobank/core/redux/eos/selectors/balances'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'

function makeMapStateToProps (state, ownProps) {
  const { wallet } = ownProps
  const mainSymbol = getMainSymbolForBlockchain(wallet.blockchain)
  const getBalance = EOSWalletBalanceSelector(wallet.id, mainSymbol)
  return (ownState) => {
    const { selectedCurrency } = getMarket(state)
    return {
      selectedCurrency,
      balance: getBalance(ownState),
    }
  }
}

@connect(makeMapStateToProps)
export default class EOSWalletWidgetMiniUsdAmount extends PureComponent {
  static propTypes = {
    selectedCurrency: PropTypes.string,
    wallet: PropTypes.instanceOf(WalletModel),
    balance: PropTypes.number,
  }

  render () {
    return <span>{this.props.selectedCurrency}&nbsp;{integerWithDelimiter(this.props.balance.toFixed(2), true)}</span>
  }
}
