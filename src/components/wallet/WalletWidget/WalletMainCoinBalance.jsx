/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { integerWithDelimiter } from 'utils/formatter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { ETH } from 'redux/mainWallet/actions'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { balanceSelector, mainWalletBalanceSelector } from 'redux/mainWallet/selectors'
import { multisigBalanceSelector, multisigWalletBalanceSelector } from 'redux/multisigWallet/selectors'
import { getMainSymbolForBlockchain } from 'redux/tokens/selectors'
import './WalletWidget.scss'
import { prefix } from './lang'

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
    return {
      mainSymbol,
      amountUsd: getAmount(ownState),
      balance: getBalance(ownState),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletMainCoinBalance extends PureComponent {
  static propTypes = {
    mainSymbol: PropTypes.string,
    amountUsd: PropTypes.number,
    balance: PropTypes.number,
    wallet: PropTypes.shape({
      address: PropTypes.string,
      blockchain: PropTypes.string,
      name: PropTypes.string,
      requiredSignatures: PropTypes.number,
      pendingCount: PropTypes.number,
      isMultisig: PropTypes.bool,
      isTimeLocked: PropTypes.bool,
      is2FA: PropTypes.bool,
      isDerived: PropTypes.bool,
      customTokens: PropTypes.arrayOf(),
    }),
  }

  render () {
    const { mainSymbol, amountUsd, balance } = this.props

    return (
      <div styleName='token-amount'>
        <div styleName='crypto-amount'>
          {mainSymbol} {integerWithDelimiter(balance, true, null)}
        </div>
        <div styleName='usd-amount'>
          USD {integerWithDelimiter(amountUsd.toFixed(2), true)}
        </div>
      </div>
    )
  }
}
