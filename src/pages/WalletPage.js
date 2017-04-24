import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  SendWidget,
  BalancesWidget
} from '../components/pages/WalletPage'
import TransactionsWidget from '../components/common/TransactionsWidget'
import { getTransactionsByAccount } from '../redux/wallet/actions'
import globalStyles from '../styles'

const mapStateToPropsWidget = (state) => ({
  transactions: state.get('wallet').transactions,
  toBlock: state.get('wallet').toBlock,
  isFetching: state.get('wallet').isFetching
})

const mapDispatchToPropsWidget = (dispatch) => ({
  getTransactions: (toBlock = null) => dispatch(getTransactionsByAccount(window.localStorage.account, toBlock))
})

const ConnectedTransactionsWidget = connect(mapStateToPropsWidget, mapDispatchToPropsWidget)(TransactionsWidget)

class WalletPage extends Component {
  render () {
    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / Wallet</span>
        <div className='row'>
          <div className='col-sm-6'>
            <SendWidget />
          </div>
          <div className='col-sm-6'>
            <BalancesWidget />
          </div>
        </div>
        <div className='row' style={{marginTop: 20}}>
          <div className='col-sm-12'>
            <ConnectedTransactionsWidget />
          </div>
        </div>
      </div>
    )
  }
}

export default WalletPage
