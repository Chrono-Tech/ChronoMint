import React, { Component } from 'react'
import { connect } from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import PageBase from '../pages/PageBase2'
import { getPolls } from '../redux/polls/data'
import { PageTitle, Polls, Search } from '../components/pages/votingPage/'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  polls: state.get('polls'),
  pollsCommunication: state.get('pollsCommunication'),
  deposit: state.get('wallet').time.deposit
})

const mapDispatchToProps = (dispatch) => ({
  getPolls: (account) => dispatch(getPolls(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class VotingPage extends Component {
  componentWillMount () {
    if (!this.props.pollsCommunication.isFetched && !this.props.pollsCommunication.isFetching) {
      this.props.getPolls(this.props.account)
    }
  }

  render () {
    const {polls} = this.props
    return (
      <PageBase title={<PageTitle />}>

        <Search />

        <div style={{minWidth: 300}}>
          <span>
            {polls.size} entries. Deposit: {this.props.deposit}
          </span>
        </div>

        <Polls polls={polls} />

        {
          this.props.pollsCommunication.isFetching
            ? <CircularProgress
              style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)'}} />
            : null
        }

      </PageBase>
    )
  }
}

export default VotingPage
