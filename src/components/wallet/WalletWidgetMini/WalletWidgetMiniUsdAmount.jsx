/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { getMainSymbolForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import { walletBalanceSelector } from '@chronobank/core/redux/wallets/selectors/balances'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import { connect } from 'react-redux'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import { selectCurrentCurrency } from '@chronobank/market/redux/selectors'

function makeMapStateToProps (state, ownProps) {
  const { wallet } = ownProps
  const mainSymbol = getMainSymbolForBlockchain(wallet.blockchain)
  const getBalance = walletBalanceSelector(wallet.id, mainSymbol)
  const mapStateToProps = (ownState) => {
    const selectedCurrency = selectCurrentCurrency(state)
    return {
      selectedCurrency,
      balance: getBalance(ownState),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletWidgetMiniUsdAmount extends PureComponent {
  static propTypes = {
    selectedCurrency: PropTypes.string,
    wallet: PTWallet,
    balance: PropTypes.number,
  }

  render () {
    return <span>{this.props.selectedCurrency}&nbsp;{integerWithDelimiter(this.props.balance.toFixed(2), true)}</span>
  }
}
