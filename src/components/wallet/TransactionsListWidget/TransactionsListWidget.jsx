/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TransactionsTable from 'components/dashboard/TransactionsTable/TransactionsTable'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { getTxListForWallet } from '@chronobank/core/redux/wallets/selectors/transactions'
import { formatDataAndGetTransactionsForWallet } from '@chronobank/core/redux/wallet/actions'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import TxHistoryModel from '@chronobank/core/models/wallet/TxHistoryModel'
import { prefix } from './lang'
import './TransactionsListWidget.scss'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  const getTransactions = getTxListForWallet(wallet.id)

  return (ownState) => {
    return {
      transactionsHistory: getTransactions(ownState),
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTransactions: (params) => dispatch(formatDataAndGetTransactionsForWallet(params)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class TransactionsListWidget extends PureComponent {
  static propTypes = {
    wallet: PTWallet,
    transactionsHistory: PropTypes.instanceOf(TxHistoryModel),
    getTransactions: PropTypes.func,
  }

  componentDidMount () {
    this.handleGetTransactions()
  }

  handleGetTransactions = () => {
    const { wallet } = this.props
    this.props.getTransactions({
      wallet,
      address: wallet.address,
      blockchain: wallet.blockchain,
    })
  }

  render () {
    const { wallet, transactionsHistory } = this.props

    return (
      <div styleName='transactions'>
        <div styleName='header'>
          <Translate value={`${prefix}.transactions`} />
        </div>
        <TransactionsTable
          transactionsHistory={transactionsHistory}
          walletAddress={wallet.address}
          blockchain={wallet.blockchain}
          onGetTransactions={this.handleGetTransactions}
          transactions={this.props.transactions}
        />
      </div>
    )
  }
}

