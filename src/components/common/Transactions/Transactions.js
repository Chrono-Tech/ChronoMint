import React, { Component } from 'react'
import {
  CircularProgress, Divider, Paper, RaisedButton, Table, TableBody, TableFooter, TableHeader, TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui'
import globalStyles from '../../../styles'
import defaultStyles from './styles'
import { Translate } from 'react-redux-i18n'
import EtherscankLink from '../../common/EtherscankLink'

class Transactions extends Component {
  render () {
    const {transactions, isFetching, toBlock, title, additionalColumns} = this.props

    const defaultLoadMoreButton = <RaisedButton
      label={<Translate value='tx.loadMoreFromBlock' block={toBlock} />}
      onTouchTap={() => this.props.onLoadMore()} fullWidth primary />

    const loadMoreButton = this.props.loadMoreButton || defaultLoadMoreButton

    const styles = this.props.styles || defaultStyles

    const headers = [
      <TableHeaderColumn key='block' style={styles.columns.id}><Translate value='terms.block' /></TableHeaderColumn>,
      <TableHeaderColumn key='hash' style={styles.columns.hash}><Translate value='terms.hash' /></TableHeaderColumn>,
      <TableHeaderColumn key='time' style={styles.columns.time}><Translate value='terms.time' /></TableHeaderColumn>,
      <TableHeaderColumn key='value' style={styles.columns.value}><Translate value='terms.value' /></TableHeaderColumn>
    ]

    if (additionalColumns) {
      additionalColumns.map((column) => { headers.push(column.header) })
    }

    const body = transactions.sortBy(x => x.blockNumber)
      .reverse()
      .valueSeq()
      .map((tx) => {
        const columns = [
          <TableRowColumn key='block' style={styles.columns.id}>{tx.blockNumber}</TableRowColumn>,
          <TableRowColumn key='hash' style={styles.columns.hash}>
            <EtherscankLink txHash={tx.txHash} />
          </TableRowColumn>,
          <TableRowColumn key='time' style={styles.columns.time}>{tx.time()}</TableRowColumn>,
          <TableRowColumn key='value' style={styles.columns.value}>
            { (tx.sign() || '') + tx.value() + ' ' + tx.symbol() }
          </TableRowColumn>
        ]

        if (additionalColumns) {
          additionalColumns.map((column) => { columns.push(column.contentByTx(tx)) })
        }
        return <TableRow key={tx.id()}>{ columns }</TableRow>
      })

    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value={title || 'tx.transactions'} /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              { headers }
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            { body }
            {!transactions.size && !isFetching ? (<TableRow>
              <TableRowColumn>
                <Translate value='tx.noTransactions' />
              </TableRowColumn>
            </TableRow>) : ''}
            {isFetching
              ? (<TableRow key='loader'>
                <TableRowColumn style={{width: '100%', textAlign: 'center'}} colSpan={4}>
                  <CircularProgress style={{margin: '0 auto'}} size={24} thickness={1.5} />
                </TableRowColumn>
              </TableRow>) : null}
          </TableBody>
          {!isFetching && toBlock > 0 ? <TableFooter adjustForCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                {loadMoreButton}
              </TableRowColumn>
            </TableRow>
          </TableFooter> : ''}
        </Table>
      </Paper>
    )
  }
}

export default Transactions
