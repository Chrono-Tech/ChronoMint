/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getTwoFaChecked, isHave2FAWallets } from '@chronobank/core/redux/wallets/selectors'
import WalletWidget from 'components/wallet/WalletWidget/WalletWidget'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MainWalletModel from '@chronobank/core/models/wallet/MainWalletModel'
import TwoFAWarningWidget from 'components/wallet/TwoFAWarningWidget/TwoFAWarningWidget'
import WalletWidgetMini from 'components/wallet/WalletWidgetMini/WalletWidgetMini'
import { DUCK_UI } from 'redux/ui/constants'
import { sectionsSelector } from '@chronobank/core/redux/wallets/selectors/wallets'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import './WalletsContent.scss'

const mapStateToProps = (state) => {
  const { isCompactWalletView } = state.get(DUCK_UI)
  return {
    isCompactWalletView,
    check2FAChecked: getTwoFaChecked(state),
    isHave2FAWallets: isHave2FAWallets(state),
    walletsList: sectionsSelector(state),
  }
}

@connect(mapStateToProps)
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
          PropTypes.instanceOf(MultisigEthWalletModel),
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
            {walletGroup.data.map((wallet, i) => {
              return (
                <Component
                  showGroupTitle={i === 0}
                  key={`${walletGroup.title}-${wallet.address}`}
                  blockchain={walletGroup.title}
                  address={wallet.address}
                />
              )
            })}
          </div>
        ))}
      </div>
    )
  }
}
