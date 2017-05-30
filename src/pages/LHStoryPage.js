import React, { Component } from 'react'
import { connect } from 'react-redux'
import { nextStoryList } from '../redux/lhStory/lhStory'
import styles from '../styles'
import Transactions from '../components/common/Transactions/Transactions'
import { Translate } from 'react-redux-i18n'
import { RaisedButton } from 'material-ui'

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
    return (
      <div>
        <span style={styles.navigation}>ChronoMint / <Translate value='nav.lhStory' /></span>
        <Transactions
          title='tx.lhOperationsStory'
          isFetching={isFetching}
          toBlock={toBlock}
          transactions={transactions}
          onLoadMore={this.props.loadNextPage}
          loadMoreButton={<RaisedButton
            label={<Translate value='tx.loadMore' />}
            onTouchTap={() => this.props.loadNextPage()} fullWidth primary />}
        />
      </div>
    )
  }
}

export default LHStoryPage
