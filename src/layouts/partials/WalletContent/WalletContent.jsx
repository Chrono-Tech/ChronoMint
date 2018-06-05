/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DUCK_WALLET } from 'redux/wallet/actions'
import WalletWidgetDetail from 'components/wallet/WalletWidgetDetail/WalletWidgetDetail'
import { TransactionsTable } from 'components'
import { walletDetailSelector, walletInfoSelector } from 'redux/wallet/selectors'
import MainWalletModel from 'models/wallet/MainWalletModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import TokensListWidget from 'components/wallet/TokensListWidget/TokensListWidget'
import PendingTxWidget from 'components/wallet/PendingTxWidget/PendingTxWidget'
import OwnersListWidget from 'components/wallet/OwnersListWidget/OwnersListWidget'
import { getTransactionsForWallet, goToWallets } from 'redux/mainWallet/actions'
import DerivedWalletModel from 'models/wallet/DerivedWalletModel'

import './WalletContent.scss'
import { prefix } from './lang'

function mapStateToProps (state) {
  const network = state.get(DUCK_NETWORK)
  const { isMultisig, blockchain, address } = state.get(DUCK_WALLET)
  const wallet = walletDetailSelector(blockchain, address)(state)

  return {
    isMultisig,
    blockchain,
    address,
    wallet,
    walletInfo: walletInfoSelector(wallet, blockchain, address, false, state),
    selectedNetworkId: network.selectedNetworkId,
    selectedProviderId: network.selectedProviderId,
    isTesting: isTestingNetwork(network.selectedNetworkId, network.selectedProviderId),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    goToWallets: () => dispatch(goToWallets()),
    getTransactions: (params) => dispatch(getTransactionsForWallet(params)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletContent extends Component {
  static propTypes = {
    isMultisig: PropTypes.bool,
    isTesting: PropTypes.bool,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,
    blockchain: PropTypes.string,
    address: PropTypes.string,
    goToWallets: PropTypes.func,
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(MainWalletModel),
      PropTypes.instanceOf(MultisigWalletModel),
      PropTypes.instanceOf(DerivedWalletModel),
    ]),
    walletInfo: PropTypes.shape({
      address: PropTypes.string,
      balance: PropTypes.number,
      tokens: PropTypes.array,
    }),
    getTransactions: PropTypes.func,
  }

  constructor (props) {
    super(props)

    if (!props.blockchain || !props.address) {
      props.goToWallets()
    }
  }

  componentDidMount () {
    this.handleGetTransactions(true)
  }

  handleGetTransactions = (forcedOffset) => {
    const { wallet, address, blockchain } = this.props
    this.props.getTransactions({ wallet, address, blockchain, forcedOffset })
  }

  render () {
    const { blockchain, address, wallet, walletInfo } = this.props

    if (!wallet || !walletInfo) {
      return null
    }
    let transactions
    if (wallet instanceof MainWalletModel) {
      transactions = wallet.transactions({ blockchain, address })
    } else {
      transactions = wallet.transactions()
    }

    return (
      <div styleName='root'>
        <WalletWidgetDetail blockchain={blockchain} address={address} wallet={wallet} walletInfo={walletInfo} />

        {walletInfo.tokens.length > 1 && <TokensListWidget tokensList={walletInfo.tokens} />}

        {wallet.isMultisig() && <PendingTxWidget wallet={wallet} />}

        {wallet.isMultisig() && <OwnersListWidget wallet={wallet} />}

        <div styleName='transactions'>
          <div styleName='header'><Translate value={`${prefix}.transactions`} /></div>
          <TransactionsTable transactions={transactions} walletAddress={address} blockchain={blockchain} onGetTransactions={this.handleGetTransactions} />
        </div>
      </div>
    )
  }
}
