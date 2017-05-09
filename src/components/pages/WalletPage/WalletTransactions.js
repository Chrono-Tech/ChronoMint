import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTransactionsByAccount } from '../../../redux/wallet/actions'
import LS from '../../../dao/LocalStorageDAO'
import Transactions from '../../common/Transactions/Transactions'

const mapStateToProps = (state) => ({
  transactions: state.get('wallet').transactions,
  toBlock: state.get('wallet').toBlock,
  isFetching: state.get('wallet').isFetching,
  isFetched: state.get('wallet').isFetched
})

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (toBlock = null) => dispatch(getTransactionsByAccount(LS.getAccount(), toBlock))
})

@connect(mapStateToProps, mapDispatchToProps)
class TransactionsWidget extends Component {
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

export default TransactionsWidget
