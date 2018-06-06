/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getIsHave2FAWallets } from 'redux/wallet/selectors'
import { WalletWidget } from 'components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MainWalletModel from 'models/wallet/MainWalletModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import TwoFAWarningWidget from 'components/wallet/TwoFAWarningWidget/TwoFAWarningWidget'
import { DUCK_MULTISIG_WALLET } from 'redux/multisigWallet/actions'
import WalletWidgetMini from 'components/wallet/WalletWidgetMini/WalletWidgetMini'
import { DUCK_UI } from 'redux/ui/reducer'
import './WalletsContent.scss'
import { sectionsSelector } from './selectors'

const mapStateToProps = (state) => {
  const check2FAChecked = state.get(DUCK_MULTISIG_WALLET).twoFAConfirmed()
  const { isCompactWalletView } = state.get(DUCK_UI)
  return {
    isCompactWalletView,
    check2FAChecked,
    isHave2FAWallets: getIsHave2FAWallets(state),
    walletsList: sectionsSelector(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletsContent extends Component {
  static propTypes = {
    isCompactWalletView: PropTypes.bool,
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
    const Component = this.props.isCompactWalletView ? WalletWidgetMini : WalletWidget
    return (
      <div styleName='root'>
        {this.props.check2FAChecked === false && this.props.isHave2FAWallets && <TwoFAWarningWidget />}
        {this.props.walletsList.map((walletGroup) => (
          <div key={walletGroup.title}>
            {walletGroup.data.map((wallet, i) => (
              <Component
                showGroupTitle={i === 0}
                key={`${walletGroup.title}-${wallet.address}`}
                blockchain={walletGroup.title}
                address={wallet.address}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }
}
