/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { balanceSelector } from '@chronobank/core/redux/mainWallet/selectors'
import { multisigBalanceSelector } from '@chronobank/core/redux/multisigWallet/selectors'
import { getMainSymbolForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import { connect } from 'react-redux'
import { integerWithDelimiter } from 'platform/utils/formatter'
import { getMarket } from '@chronobank/core/redux/market/selectors'

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
