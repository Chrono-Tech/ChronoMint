import React, { Component } from 'react'
import { connect } from 'react-redux'
import { nextStoryList } from '../redux/lhStory/lhStory'
import styles from '../styles'
import Transactions from '../components/common/Transactions/Transactions'
import TransactionModel from '../models/TransactionModel'
import { Translate } from 'react-redux-i18n'
import { RaisedButton, TableRowColumn, TableHeaderColumn } from 'material-ui'

const mapStateToProps = (state) => {
  return state.get('lhStory')
}

const mapDispatchToProps = (dispatch) => ({
  loadNextPage: () => dispatch(nextStoryList())
})

@connect(mapStateToProps, mapDispatchToProps)
class LHStoryPage extends Component {
  componentDidMount () {
    if (!this.props.isFetched) {
      this.props.loadNextPage()
    }
  }

  render () {
    const {transactions, isFetching, toBlock} = this.props
    const loadMoreButton =
      <RaisedButton label={<Translate value='tx.loadMore' />} onTouchTap={() => this.props.loadNextPage()} fullWidth primary />

    const tableStyles = {
      columns: {
        id: {
          width: '10%'
        },
        hash: {
          width: '40%'
        },
        time: {
          width: '25%'
        },
        value: {
          width: '15%'
        },
        action: {
          width: '10%'
        }
      }
    }

    return (
      <div>
        <span style={styles.navigation}>ChronoMint / <Translate value='nav.tokenStory' /></span>
        <Transactions
          title='tx.tokenStory'
          isFetching={isFetching}
          toBlock={toBlock}
          transactions={transactions}
          onLoadMore={this.props.loadNextPage}
          loadMoreButton={loadMoreButton}
          additionalColumns={[
            {
              header: <TableHeaderColumn style={tableStyles.columns.action} key="action">Action</TableHeaderColumn>,
              contentByTx: (tx: TransactionModel) => (<TableRowColumn style={tableStyles.columns.action} key="action">{ tx.rawTx.event }</TableRowColumn>)
            }
          ]}
          styles={ tableStyles }
        />
      </div>
    )
  }
}

export default LHStoryPage
