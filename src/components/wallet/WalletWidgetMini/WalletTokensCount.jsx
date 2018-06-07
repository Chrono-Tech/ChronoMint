/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { tokensCountSelector } from 'redux/mainWallet/selectors'
import { multisigTokensCountSelector } from 'redux/multisigWallet/selectors'
import { connect } from 'react-redux'
import { prefix } from './lang'

function makeMapStateToProps (state, ownProps) {
  const { wallet } = ownProps
  let getTokensCount
  if (wallet.isMain) {
    getTokensCount = tokensCountSelector(wallet.blockchain)
  } else {
    getTokensCount = multisigTokensCountSelector(wallet.address)
  }
  const mapStateToProps = (ownState) => {
    return {
      tokensCount: getTokensCount(ownState),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletTokensCount extends PureComponent {
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
    tokensCount: PropTypes.number,
  }

  render () {
    if (this.props.tokensCount > 1) {
      return <Translate value={`${prefix}.tokensCount`} count={this.props.tokensCount} />
    }
    return null
  }
}