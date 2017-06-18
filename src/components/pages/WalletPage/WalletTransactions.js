import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getTransactionsByAccount } from '../../../redux/wallet/actions'
import Transactions from '../../common/Transactions/Transactions'

const mapStateToProps = (state) => ({
  tokens: state.get('wallet').tokens,
  transactions: state.get('wallet').transactions.list,
  toBlock: state.get('wallet').transactions.toBlock,
  isFetching: state.get('wallet').transactions.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (tokens, toBlock = null) => dispatch(getTransactionsByAccount(tokens, toBlock))
})

@connect(mapStateToProps, mapDispatchToProps)
class WalletTransactions extends Component {
  handleLoadMore = () => {
    this.props.getTransactions(this.props.tokens, this.props.toBlock)
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

WalletTransactions.propTypes = {
  getTransactions: PropTypes.func,
  isFetching: PropTypes.bool,
  toBlock: PropTypes.number,
  transactions: PropTypes.object,
  tokens: PropTypes.object
}

export default WalletTransactions
