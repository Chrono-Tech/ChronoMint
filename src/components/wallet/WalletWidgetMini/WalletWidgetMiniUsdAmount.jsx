/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { balanceSelector } from 'redux/mainWallet/selectors'
import { multisigBalanceSelector } from 'redux/multisigWallet/selectors'
import { connect } from 'react-redux'

function makeMapStateToProps (state, ownProps) {
  const { wallet } = ownProps
  let getAmount
  if (wallet.isMain) {
    getAmount = balanceSelector(wallet.blockchain)
  } else {
    getAmount = multisigBalanceSelector(wallet.address)
  }
  const mapStateToProps = (ownState) => {
    return {
      amount: getAmount(ownState),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletWidgetMiniUsdAmount extends PureComponent {
  static propTypes = {
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
    amount: PropTypes.number,
  }

  render () {
    return <span>USD&nbsp;{this.props.amount}</span>
  }
}
