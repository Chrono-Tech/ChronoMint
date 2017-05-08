import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  CircularProgress, Divider, Paper, RaisedButton, Table, TableBody, TableFooter, TableHeader, TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui'
import globalStyles from '../../../styles'
import styles from './styles'
import { getScannerById } from '../../../network/settings'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  selectedProviderId: state.get('network').selectedProviderId
})

@connect(mapStateToProps, null)
class Transactions extends Component {
  getEtherscanUrl = () => {
    const {selectedNetworkId, selectedProviderId} = this.props
    const baseScannerUrl = getScannerById(selectedNetworkId, selectedProviderId)
    return baseScannerUrl ? `${baseScannerUrl}/tx/` : null
  }

  render () {
    const etherscanHref = this.getEtherscanUrl()
    const {transactions, isFetching, toBlock} = this.props

    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}>Transactions</h3>
        <Divider style={{backgroundColor: globalStyles.title.color}}/>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columns.id}>Block</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.hash}>Hash</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.time}>Time</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.actions}>Action</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.value}>Value</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {transactions.sortBy(x => x.blockNumber)
              .reverse()
              .valueSeq()
              .map(tx => (
                <TableRow key={tx.id()}>
                  <TableRowColumn style={styles.columns.id}>{tx.blockNumber}</TableRowColumn>
                  <TableRowColumn style={styles.columns.hash}>
                    { etherscanHref
                      ? <a href={etherscanHref + tx.txHash} target='_blank'>{tx.txHash}</a>
                      : tx.txHash
                    }
                  </TableRowColumn>
                  <TableRowColumn style={styles.columns.time}>{tx.time()}</TableRowColumn>
                  <TableRowColumn style={styles.columns.actions}>{tx.action()}</TableRowColumn>
                  <TableRowColumn style={styles.columns.value}>
                    {tx.sign() + tx.value() + ' ' + tx.symbol}
                  </TableRowColumn>
                </TableRow>
              ))}
            {!transactions.size && !isFetching ? (<TableRow>
              <TableRowColumn>
                No transactions.
              </TableRowColumn>
            </TableRow>) : ''}
            {isFetching
              ? (<TableRow key='loader'>
                <TableRowColumn style={{width: '100%', textAlign: 'center'}} colSpan={4}>
                  <CircularProgress style={{margin: '0 auto'}} size={24} thickness={1.5}/>
                </TableRowColumn>
              </TableRow>) : null}
          </TableBody>
          {!isFetching && toBlock > 0 ? <TableFooter adjustForCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                <RaisedButton
                  label={'Load More – From ' + toBlock + ' Block'}
                  onTouchTap={() => this.props.onLoadMore()} fullWidth primary/>
              </TableRowColumn>
            </TableRow>
          </TableFooter> : ''}
        </Table>
      </Paper>
    )
  }
}

export default Transactions
