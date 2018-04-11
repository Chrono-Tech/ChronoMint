import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import classNames from 'classnames'
import TokenModel from 'models/tokens/TokenModel'
import TokensCollection from 'models/tokens/TokensCollection'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { TOKEN_ICONS } from 'assets'
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

function mapStateToProps (state) {

  return {
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {

  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletsContent extends Component {
  static propTypes = {
    tokens: PropTypes.instanceOf(TokensCollection),
  }


  render () {

    const token = this.props.tokens.item('BTC')
    const ETHToken = this.props.tokens.item('ETH')

    return (<div styleName='root'>

      <div styleName='header-container'>
        <h1 styleName='header-text'>Bitcoin Wallets</h1>
      </div>

      <BitcoinWallet token={token} />

      <div styleName='header-container'>
        <h1 styleName='header-text'>Ethereum Wallets</h1>
      </div>

      <EthereumWallet token={ETHToken} />

      <SharedWallet token={ETHToken} />

      <LockedWallet token={ETHToken} />

    </div>)
  }
}
