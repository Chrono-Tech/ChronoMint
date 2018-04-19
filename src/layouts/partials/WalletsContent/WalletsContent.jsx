import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import classNames from 'classnames'
import TokenModel from 'models/tokens/TokenModel'
import TokensCollection from 'models/tokens/TokensCollection'
import { PROFILE_PANEL_TOKENS } from 'dao/ERC20ManagerDAO'
import { TOKEN_ICONS } from 'assets'
import { makeGetSectionedWallets, multisigWalletsSelector } from 'redux/wallet/selectors'
import {
  DepositTokens,
  Points,
  Button,
  SendTokens,
  IPFSImage,
  TransactionsTable,
  BitcoinWallet,
  EthereumWallet,
  SharedWallet,
  LockedWallet,
  WalletChanger,
  WalletPendingTransfers
} from 'components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_WALLET } from 'redux/wallet/actions'

import './WalletsContent.scss'

function mapDispatchToProps (dispatch) {
  return {

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    // walletsList: makeGetSectionedWallets()(state, ownProps),
    walletsList: multisigWalletsSelector()(state, ownProps),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletsContent extends Component {
  static propTypes = {
    walletsList: PropTypes.object
  }

  renderBitcoinWallet = () => {
    const bitcoin = this.props.walletsList.find(a => a.title === 'Bitcoin')

    if (!bitcoin) {
      return null
    }

    return (
      <BitcoinWallet blockchainTitle='Bitcoin' wallet={bitcoin.data[0].wallet} tokenTitle='BTC' address={bitcoin.data[0].address} />
    )
  }

  renderEthereumWallet = () => {
    const ethereum = this.props.walletsList.find(a => a.title === 'Ethereum')

    if (!ethereum) {
      return null
    }

    return (
      <div styleName='wallet-list-container'>
        {ethereum.data.map((walletData) => {
          return <EthereumWallet blockchainTitle='Ethereum' wallet={walletData.wallet} tokenTitle='ETH' address={walletData.address} />
        })}
      </div>
    )
  }


  render () {

    return (<div styleName='root'>

      <div styleName='header-container'>
        <h1 styleName='header-text'>Bitcoin Wallets</h1>
      </div>

      { this.renderBitcoinWallet() }

      <div styleName='header-container'>
        <h1 styleName='header-text'>Ethereum Wallets</h1>
      </div>

      {this.renderEthereumWallet()}


    </div>)
  }
}
