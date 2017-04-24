import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Paper, Divider} from 'material-ui'
import {Table, TableHeader, TableBody, TableHeaderColumn, TableRowColumn, TableRow} from 'material-ui/Table'
import TransactionsWidget from '../components/common/TransactionsWidget'
import { listStory, getLHTransactions } from '../redux/lhStory/lhStory'
import styles from '../styles'

const customStyles = {
  columns: {
    name: {
      width: '15%'
    },
    address: {
      width: '55%'
    }
  }
}

const mapStateToPropsWidget = (state) => ({
  transactions: state.get('lhStory').transactions,
  toBlock: state.get('lhStory').toBlock,
  isFetching: state.get('lhStory').isFetching,
  title: 'LHT Transactions from all accounts'
})

const mapDispatchToPropsWidget = (dispatch) => ({
  getTransactions: (toBlock = null, isAllLH = false) => {
    dispatch(getLHTransactions('all', toBlock))
  }
})

const ConnectedTransactionsWidget = connect(mapStateToPropsWidget, mapDispatchToPropsWidget)(TransactionsWidget)

const mapStateToProps = (state) => ({
  list: state.get('lhStory').list
})

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listStory())
})

@connect(mapStateToProps, mapDispatchToProps)
class LHStoryPage extends Component {
  componentDidMount () {
    this.props.getList()
  }

  render () {
    return (
      <div>
        <span style={styles.navigation}>ChronoMint / LH story</span>

        <Paper style={styles.paper}>
          <h3 style={styles.title}>LH Operations Story</h3>
          <Divider />

          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={customStyles.columns.name}>One</TableHeaderColumn>
                <TableHeaderColumn style={customStyles.columns.address}>Two</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.props.list.entrySeq().map(([index, item]) =>
                <TableRow key={index}>
                  <TableRowColumn style={customStyles.columns.name}>{index}</TableRowColumn>
                  <TableRowColumn style={customStyles.columns.address}>{item}</TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        <div className='row' style={{ marginTop: 20 }}>
          <div className='col-sm-12'>
            <ConnectedTransactionsWidget />
          </div>
        </div>
      </div>
    )
  }
}

export default LHStoryPage
