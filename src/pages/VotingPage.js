import React, {Component} from 'react'
import {connect} from 'react-redux'
import PageBase from '../pages/PageBase2'
import {getPolls} from '../redux/polls/data'
import {PageTitle, Polls, Search} from '../components/pages/votingPage/'

const mapStateToProps = (state) => ({
  polls: state.get('polls'),
  pollsCommunication: state.get('pollsCommunication'),
  time: state.get('wallet').time
})

const mapDispatchToProps = (dispatch) => ({
  getPolls: (account) => dispatch(getPolls(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class VotingPage extends Component {
  componentWillMount () {
    if (!this.props.pollsCommunication.isReady && !this.props.pollsCommunication.isFetching) {
      this.props.getPolls(window.localStorage.chronoBankAccount)
    }
  }

  render () {
    const {polls} = this.props
    return (
      <PageBase title={<PageTitle />} >

        <Search />

        <div style={{ minWidth: 300 }}>
          <span>
            {polls.size} entries. Deposit: {this.props.time.deposit}
          </span>
        </div>

        <Polls polls={polls} />

      </PageBase>
    )
  }
}

export default VotingPage
