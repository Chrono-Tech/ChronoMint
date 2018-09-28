/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { formatDataAndGetTransactionsForWallet } from '@chronobank/core/redux/wallet/actions'
import { DUCK_WALLET } from '@chronobank/core/redux/wallet/constants'
import WalletWidgetDetail from 'components/wallet/WalletWidgetDetail/WalletWidgetDetail'
import TokensListWidget from 'components/wallet/TokensListWidget/TokensListWidget'
import PendingTxWidget from 'components/wallet/PendingTxWidget/PendingTxWidget'
import OwnersListWidget from 'components/wallet/OwnersListWidget/OwnersListWidget'
import { navigateToWallets } from 'redux/ui/navigation'
import { getWalletInfo } from '@chronobank/core/redux/wallets/selectors/wallet'
import TransactionsListWidget from 'components/wallet/TransactionsListWidget/TransactionsListWidget'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'

import './WalletContent.scss'

function makeMapStateToProps (state) {
  const { blockchain, address } = state.get(DUCK_WALLET)
  const getWallet = getWalletInfo(blockchain, address)
  const mapStateToProps = (ownState) => {
    const network = state.get(DUCK_NETWORK)
    return {
      wallet: getWallet(ownState),
      selectedNetworkId: network.selectedNetworkId,
      selectedProviderId: network.selectedProviderId,
      isTesting: isTestingNetwork(network.selectedNetworkId, network.selectedProviderId),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    navigateToWallets: () => dispatch(navigateToWallets()),
    getTransactions: (params) => dispatch(formatDataAndGetTransactionsForWallet(params)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class WalletContent extends Component {
  static propTypes = {
    isTesting: PropTypes.bool,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,
    navigateToWallets: PropTypes.func,
    getTransactions: PropTypes.func,
    address: PropTypes.string,
    blockchain: PropTypes.string,
    wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
  }

  constructor (props) {
    super(props)

    if (!props.wallet || !props.wallet.blockchain || !props.wallet.address) {
      props.navigateToWallets()
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
    const { wallet } = this.props

    if (!wallet) {
      return null
    }

    return (
      <div styleName='root'>
        <WalletWidgetDetail wallet={wallet} />
        <TokensListWidget walletId={wallet.id} />
        <PendingTxWidget wallet={wallet} />
        <OwnersListWidget wallet={wallet} />
        <TransactionsListWidget wallet={wallet} />
      </div>
    )
  }
}
