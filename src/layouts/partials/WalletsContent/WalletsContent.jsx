import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import classNames from 'classnames'
import TokenModel from 'models/tokens/TokenModel'
import TokensCollection from 'models/tokens/TokensCollection'
import { PROFILE_PANEL_TOKENS } from 'dao/ERC20ManagerDAO'
import { TOKEN_ICONS } from 'assets'
import { makeGetWalletTokensAndBalanceByAddress, makeGetSectionedWallets } from 'redux/wallet/selectors'
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
    walletsList: makeGetSectionedWallets()(state),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletsContent extends Component {
  static propTypes = {

  }


  render () {

    console.log('WalletsContent: ', this.props)
    console.log('PROFILE_PANEL_TOKENS: ', PROFILE_PANEL_TOKENS)


    return (<div styleName='root'>

      <div styleName='header-container'>
        <h1 styleName='header-text'>Bitcoin Wallets</h1>
      </div>

      <BitcoinWallet blockchainTitle='Bitcoin' tokenTitle='BTC' />

      <div styleName='header-container'>
        <h1 styleName='header-text'>Ethereum Wallets</h1>
      </div>

      <EthereumWallet blockchainTitle='Ethereum' />

      {/*<SharedWallet token={ETHToken} />*/}

      {/*<LockedWallet token={ETHToken} />*/}

    </div>)
  }
}
