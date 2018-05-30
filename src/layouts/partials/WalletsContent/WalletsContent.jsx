/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getIsHave2FAWallets, multisigWalletsSelector } from 'redux/wallet/selectors'
import { WalletWidget } from 'components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MainWalletModel from 'models/wallet/MainWalletModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TwoFAWarningWidget from 'components/wallet/TwoFAWarningWidget/TwoFAWarningWidget'
import { DUCK_MULTISIG_WALLET } from 'redux/multisigWallet/actions'
import './WalletsContent.scss'

const mapStateToProps = (state, ownProps) => {
  const check2FAChecked = state.get(DUCK_MULTISIG_WALLET).twoFAConfirmed()
  return {
    check2FAChecked,
    isHave2FAWallets: getIsHave2FAWallets(state),
    walletsList: multisigWalletsSelector()(state, ownProps),
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletsContent extends Component {
  static propTypes = {
    check2FAChecked: PropTypes.bool,
    isHave2FAWallets: PropTypes.bool,
    walletsList: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        address: PropTypes.string,
        wallet: PropTypes.oneOfType([
          PropTypes.instanceOf(MainWalletModel),
          PropTypes.instanceOf(MultisigWalletModel),
        ]),
      }),
    ),
  }

  render () {
    return (
      <div styleName='root'>
        {!this.props.check2FAChecked && this.props.isHave2FAWallets && <TwoFAWarningWidget />}
        {this.props.walletsList.map((walletGroup) => (
          <div key={walletGroup.title}>
            {walletGroup.data.map((wallet) => (
              <WalletWidget
                key={`${walletGroup.title}-${wallet.address}`}
                blockchain={walletGroup.title}
                address={wallet.address}
                wallet={wallet.wallet}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }
}
