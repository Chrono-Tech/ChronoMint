import React, {Component} from 'react'
import {connect} from 'react-redux'
import PageBase from '../pages/PageBase2'
import {getPolls} from '../redux/polls/data'
import {PageTitle, Polls, Search} from '../components/pages/votingPage/'
import {updateTimeDeposit} from '../redux/wallet/wallet'
import {Link} from 'react-router'

const mapStateToProps = (state) => ({
  polls: state.get('polls'),
  pollsCommunication: state.get('pollsCommunication'),
  time: state.get('wallet').time
})

const mapDispatchToProps = (dispatch) => ({
  getPolls: (account) => dispatch(getPolls(account)),
  updateDeposit: (account) => dispatch(updateTimeDeposit(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class VotingPage extends Component {
  componentWillMount () {
    if (!this.props.pollsCommunication.isReady && !this.props.pollsCommunication.isFetching) {
      this.props.getPolls(window.localStorage.chronoBankAccount)
    }
    this.props.updateDeposit(window.localStorage.chronoBankAccount)
  }

  render () {
    const {polls} = this.props
    if (!this.props.time.deposit) {
      return <PageBase title={<Link to={{pathname: '/profile'}} >Deposit time tokens first</Link>} />
    }

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
