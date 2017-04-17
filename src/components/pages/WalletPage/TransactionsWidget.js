import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableFooter,
  TableHeaderColumn,
  TableRowColumn,
  RaisedButton,
  CircularProgress
} from 'material-ui'
import { getTransactionsByAccount } from '../../../redux/wallet/wallet'

import globalStyles from '../../../styles'

const styles = {
  columns: {
    id: {
      width: '10%'
    },
    hash: {
      width: '55%'
    },
    time: {
      width: '20%'
    },
    value: {
      width: '15%'
    }
  }
}

const mapStateToProps = (state) => ({
  transactions: state.get('wallet').transactions,
  isFetching: state.get('wallet').isFetching
})

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (endBlock) => dispatch(getTransactionsByAccount(window.localStorage.chronoBankAccount, 100, endBlock))
})

@connect(mapStateToProps, mapDispatchToProps)
class TransactionsWidget extends Component {
  componentWillMount () {
    this.props.getTransactions()
  }

  handleLoadMore = () => {
    const lastScannedBlock = this.props.transactions.sortBy(x => x.blockNumber).first().get('blockNumber')
    this.props.getTransactions(lastScannedBlock - 1)
  }

  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}>Transactions</h3>
        <Divider style={{backgroundColor: globalStyles.title.color}}/>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columns.id}>Block Number</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.hash}>Hash</TableHeaderColumn>
              <TableHeaderColumn>Time</TableHeaderColumn>
              <TableHeaderColumn>Value</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.transactions.sortBy(x => x.blockNumber)
              .reverse()
              .valueSeq()
              .map(tx => (
                <TableRow key={tx.blockNumber}>
                  <TableRowColumn style={styles.columns.id}>{tx.blockNumber}</TableRowColumn>
                  <TableRowColumn style={styles.columns.hash}>{tx.txHash}</TableRowColumn>
                  <TableRowColumn style={styles.columns.time}>{tx.getTransactionTime()}</TableRowColumn>
                  <TableRowColumn style={styles.columns.value}>
                    {tx.getTransactionSign() + tx.getValue() + ' ' + tx.symbol}
                  </TableRowColumn>
                </TableRow>
              ))}
            {this.props.isFetching
              ? (<TableRow key='loader'>
                <TableRowColumn style={{width: '100%', textAlign: 'center'}} colSpan={4}>
                  <CircularProgress style={{margin: '0 auto'}} size={24} thickness={1.5}/>
                </TableRowColumn>
              </TableRow>) : null}
          </TableBody>
          {!this.props.isFetching ? <TableFooter adjustForCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                <RaisedButton label='Load More' onTouchTap={this.handleLoadMore} fullWidth primary/>
              </TableRowColumn>
            </TableRow>
          </TableFooter> : ''}
        </Table>
      </Paper>
    )
  }
}

export default TransactionsWidget
