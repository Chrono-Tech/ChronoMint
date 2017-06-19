import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAccountTransactions } from '../../../redux/wallet/actions'
import Transactions from '../../common/Transactions/Transactions'

const mapStateToProps = (state) => ({
  tokens: state.get('wallet').tokens,
  transactions: state.get('wallet').transactions.list,
  isFetching: state.get('wallet').transactions.isFetching,
  endOfList: state.get('wallet').transactions.endOfList,
})

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (tokens) => dispatch(getAccountTransactions(tokens))
})

@connect(mapStateToProps, mapDispatchToProps)
class WalletTransactions extends Component {
  handleLoadMore = () => {
    this.props.getTransactions(this.props.tokens)
  }

  render () {
    const {transactions, isFetching, endOfList} = this.props

    return (
      <Transactions
        transactions={transactions}
        isFetching={isFetching}
        endOfList={endOfList}
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
