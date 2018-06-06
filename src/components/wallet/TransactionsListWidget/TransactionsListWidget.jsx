/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { TransactionsTable } from 'components'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import TokensCollection from 'models/tokens/TokensCollection'
import { makeGetTxListForWallet } from 'redux/wallet/selectors'
import TransactionsCollection from 'models/wallet/TransactionsCollection'
import { formatDataAndGetTransactionsForWallet } from 'redux/mainWallet/actions'

import { prefix } from './lang'
import './TransactionsListWidget.scss'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  const getTransactions = makeGetTxListForWallet(wallet.blockchain, wallet.address)

  const mapStateToProps = (ownState) => {
    return {
      transactions: getTransactions(ownState),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    getTransactions: (params) => dispatch(formatDataAndGetTransactionsForWallet(params)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class TransactionsListWidget extends PureComponent {
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
      owners: PropTypes.arrayOf(PropTypes.string),
      customTokens: PropTypes.arrayOf(),
    }),
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    getPendingData: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    locale: PropTypes.string,
    transactions: PropTypes.instanceOf(TransactionsCollection),
    getTransactions: PropTypes.func,
  }

  componentDidMount () {
    this.handleGetTransactions()
  }

  handleGetTransactions = () => {
    const { wallet } = this.props
    this.props.getTransactions({ wallet, address: wallet.address, blockchain: wallet.blockchain })
  }

  render () {
    const { wallet, transactions } = this.props

    return (
      <div styleName='transactions'>
        <div styleName='header'><Translate value={`${prefix}.transactions`} /></div>
        <TransactionsTable transactions={transactions} walletAddress={wallet.address} blockchain={wallet.blockchain} onGetTransactions={this.handleGetTransactions} />
      </div>
    )
  }
}

