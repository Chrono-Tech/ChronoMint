import React, { Component } from 'react'
import { connect } from 'react-redux'
import { nextStoryList, updateListByFilter } from '../redux/tokensStory/tokensStory'
import Transactions from '../components/common/Transactions/Transactions'
import TransactionModel from '../models/TransactionModel'
import { Translate } from 'react-redux-i18n'
import { RaisedButton, TableRowColumn, TableHeaderColumn, Paper } from 'material-ui'
import EtherscankLink from '../components/common/EtherscankLink'
import TokensStoryFilterForm from '../components/forms/TokensStoryFilterForm'
import globalStyles from '../styles'
import TokensStoryFilterModel from '../models/TokensStoryFilterModel'

const mapStateToProps = (state) => {
  return state.get('tokensStory')
}

const mapDispatchToProps = (dispatch) => ({
  loadNextPage: () => dispatch(nextStoryList()),
  updateListByFilter: (filter: TokensStoryFilterModel) => dispatch(updateListByFilter(filter))
})

@connect(mapStateToProps, mapDispatchToProps)
class TokensStoryPage extends Component {
  componentDidMount () {
    if (!this.props.isFetched) {
      this.props.loadNextPage()
    }
  }

  handleFilterSubmit (values) {
    this.props.updateListByFilter(new TokensStoryFilterModel(values))
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
          width: '20%'
        },
        from: {
          width: '20%'
        },
        to: {
          width: '20%'
        },
        action: {
          width: '10%'
        }
      }
    }

    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / <Translate value='nav.tokensStory' /></span>
        <Paper style={{...globalStyles.paper, marginBottom: 10}} zDepth={1} rounded={false}>
          <TokensStoryFilterForm onSubmit={this.handleFilterSubmit.bind(this)} />
        </Paper>
        <Transactions
          title='tx.tokensStory'
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

export default TokensStoryPage
