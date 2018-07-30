/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { isHave2FAWallets, getTwoFaChecked } from '@chronobank/core/redux/wallets/selectors'
import { WalletWidget } from 'components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MainWalletModel from '@chronobank/core/models/wallet/MainWalletModel'
import MultisigWalletModel from '@chronobank/core/models/wallet/MultisigWalletModel'
import TwoFAWarningWidget from 'components/wallet/TwoFAWarningWidget/TwoFAWarningWidget'
import WalletWidgetMini from 'components/wallet/WalletWidgetMini/WalletWidgetMini'
import { getBalance } from '@chronobank/core/redux/mainWallet/actions'
import { DUCK_UI } from 'redux/ui/reducer'
import { sectionsSelector } from '@chronobank/core/redux/wallets/selectors/wallets'
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

function mapDispatchToProps (dispatch) {
  return {
    getBalance: () => dispatch(getBalance()),
  }
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
    getBalance: PropTypes.func,
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
