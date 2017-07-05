// TODO new exchange
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTransactions } from '../../../redux/exchange/actions'
import Transactions from '../../common/Transactions/Transactions'

const mapStateToProps = (state) => state.get('exchange').transactions

const mapDispatchToProps = (dispatch) => ({
  getTransactions: () => dispatch(getTransactions())
})

@connect(mapStateToProps, mapDispatchToProps)
class ExchangeTransactionsWidget extends Component {
  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.getTransactions()
    }
  }

  handleLoadMore = () => {
    this.props.getTransactions(this.props.toBlock)
  }

  render () {
    const {transactions, isFetching, toBlock} = this.props

    return (
      <Transactions
        transactions={transactions}
        isFetching={isFetching}
        toBlock={toBlock}
        onLoadMore={this.handleLoadMore} />
    )
  }
}

export default ExchangeTransactionsWidget
