import React, { Component } from 'react'
import { connect } from 'react-redux'
import { nextStoryList, updateListByFilter } from '../redux/tokenStory/tokenStory'
import Transactions from '../components/common/Transactions/Transactions'
import TransactionModel from '../models/TransactionModel'
import { Translate } from 'react-redux-i18n'
import { RaisedButton, TableRowColumn, TableHeaderColumn, Paper } from 'material-ui'
import EtherscankLink from '../components/common/EtherscankLink'
import TokenStoryFilterForm from '../components/forms/TokenStoryFilterForm'
import globalStyles from '../styles'
import TokenStoryFilterModel from '../models/TokenStoryFilterModel'

const mapStateToProps = (state) => {
  return state.get('tokenStory')
}

const mapDispatchToProps = (dispatch) => ({
  loadNextPage: () => dispatch(nextStoryList()),
  updateListByFilter: (filter: TokenStoryFilterModel) => dispatch(updateListByFilter(filter))
})

@connect(mapStateToProps, mapDispatchToProps)
class TokenStoryPage extends Component {
  componentDidMount () {
    if (!this.props.isFetched) {
      this.props.loadNextPage()
    }
  }

  handleFilterSubmit (values) {
    this.props.updateListByFilter(new TokenStoryFilterModel(values))
  }

  render () {
    const {transactions, isFetching, toBlock} = this.props
    const loadMoreButton =
      <RaisedButton label={<Translate value='tx.loadMore' />} onTouchTap={() => this.props.loadNextPage()} fullWidth primary />

    const tableStyles = {
      columns: {
        id: {
          width: '5%'
        },
        hash: {
          width: '10%'
        },
        time: {
          width: '15%'
        },
        value: {
          width: '10%'
        },
        from: {
          width: '25%'
        },
        to: {
          width: '25%'
        },
        action: {
          width: '10%'
        }
      }
    }

    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / <Translate value='nav.tokenStory' /></span>
        <Paper style={{...globalStyles.paper, marginBottom: 10}} zDepth={1} rounded={false}>
          <TokenStoryFilterForm onSubmit={this.handleFilterSubmit.bind(this)} />
        </Paper>
        <Transactions
          title='tx.tokenStory'
          isFetching={isFetching}
          toBlock={toBlock}
          transactions={transactions}
          onLoadMore={this.props.loadNextPage}
          loadMoreButton={loadMoreButton}
          additionalColumns={[
            {
              header: <TableHeaderColumn style={tableStyles.columns.from} key='from'>From</TableHeaderColumn>,
              contentByTx: (tx: TransactionModel) => (
                <TableRowColumn style={tableStyles.columns.from} key='from'><EtherscankLink
                  address={tx.from} /></TableRowColumn>)
            },
            {
              header: <TableHeaderColumn style={tableStyles.columns.to} key='to'>To</TableHeaderColumn>,
              contentByTx: (tx: TransactionModel) => (
                <TableRowColumn style={tableStyles.columns.to} key='to'><EtherscankLink
                  address={tx.to} /></TableRowColumn>)
            },
            {
              header: <TableHeaderColumn style={tableStyles.columns.action} key='action'>Action</TableHeaderColumn>,
              contentByTx: (tx: TransactionModel) => (
                <TableRowColumn style={tableStyles.columns.action} key='action'>{ tx.rawTx.event }</TableRowColumn>)
            }
          ]}
          styles={tableStyles}
        />
      </div>
    )
  }
}

export default TokenStoryPage
