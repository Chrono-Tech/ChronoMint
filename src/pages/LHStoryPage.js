import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getStoryList, nextStoryList } from '../redux/lhStory/lhStory'
import styles from '../styles'
import Transactions from '../components/common/Transactions/Transactions'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => ({
  transactions: state.get('lhStory').list,
  isFetching: state.get('lhStory').isFetching,
  toBlock: state.get('lhStory').toBlock
})

const mapDispatchToProps = (dispatch) => ({
  getStoryList: () => dispatch(nextStoryList())
})

@connect(mapStateToProps, mapDispatchToProps)
class LHStoryPage extends Component {
  componentDidMount () {
    if (!this.props.isFetched) {
      this.props.getStoryList()
    }
  }

  handleLoadMore () {
    this.props.getStoryList()
  }

  render () {
    const {transactions, isFetching, toBlock} = this.props

    return (
      <div>
        <span style={styles.navigation}>ChronoMint / <Translate value='nav.lhStory' /></span>
        <Transactions
          title="tx.lhOperationsStory"
          isFetching={isFetching}
          toBlock={toBlock}
          transactions={transactions}
          onLoadMore={this.handleLoadMore.bind(this)} />
      </div>
    )
  }
}

export default LHStoryPage
