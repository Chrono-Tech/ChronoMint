/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { balanceSelector } from 'redux/mainWallet/selectors'
import { multisigBalanceSelector } from 'redux/multisigWallet/selectors'
import { getMainSymbolForBlockchain } from 'redux/tokens/selectors'
import { PTWallet } from 'redux/wallet/types'
import { connect } from 'react-redux'
import { integerWithDelimiter } from 'utils/formatter'
import { getMarket } from 'redux/market/selectors'

function makeMapStateToProps (state, ownProps) {
  const { wallet } = ownProps
  let getAmount
  const mainSymbol = getMainSymbolForBlockchain(wallet.blockchain)
  if (wallet.isMain) {
    getAmount = balanceSelector(wallet.blockchain, mainSymbol)
  } else {
    getAmount = multisigBalanceSelector(wallet.address, mainSymbol)
  }
  const mapStateToProps = (ownState) => {
    const { selectedCurrency } = getMarket(state)
    return {
      selectedCurrency,
      amount: getAmount(ownState),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletWidgetMiniUsdAmount extends PureComponent {
  static propTypes = {
    selectedCurrency: PropTypes.string,
    wallet: PTWallet,
    amount: PropTypes.number,
  }

  render () {
    return <span>{this.props.selectedCurrency}&nbsp;{integerWithDelimiter(this.props.amount.toFixed(2), true)}</span>
  }
}
