import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTransactions } from '../../../redux/exchange/transactions'
import LS from '../../../dao/LocalStorageDAO'
import Transactions from '../../common/Transactions/Transactions'

const mapStateToProps = (state) => ({
  toBlock: state.get('exchangeTransactions').toBlock,
  transactions: state.get('exchangeTransactions').transactions,
  isFetching: state.get('exchangeTransactions').isFetching,
  isFetched: state.get('exchangeTransactions').isFetched
})

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (account) => dispatch(getTransactions(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class ExchangeTransactionsWidget extends Component {
  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.getTransactions(LS.getAccount())
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
        onLoadMore={this.handleLoadMore}/>
    )
  }
}

export default ExchangeTransactionsWidget
