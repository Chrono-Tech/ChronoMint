import { DepositTokens, Rewards, SendTokens, Voting } from 'components'
import { Paper } from 'material-ui'
import RewardsModel from 'models/rewards/RewardsModel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DUCK_REWARDS, getRewardsData, initRewards } from 'redux/rewards/actions'
import { getCurrentWallet } from 'redux/wallet/actions'
import './DashboardContent.scss'

function mapStateToProps (state) {
  const wallet = getCurrentWallet(state)
  const voting = state.get('voting')

  return {
    rewards: state.get(DUCK_REWARDS),
    isVotingFetched: voting.isFetched && wallet.isFetched(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getRewardsData: () => dispatch(getRewardsData()),
    initRewards: () => dispatch(initRewards()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DashboardContent extends Component {
  static propTypes = {
    rewards: PropTypes.instanceOf(RewardsModel),
    isVotingFetched: PropTypes.bool,
    initRewards: PropTypes.func,
    getRewardsData: PropTypes.func,
  }

  componentWillMount () {
    this.props.initRewards()
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <div className='DashboardContent__grid'>
              <div className='row'>
                <div className='col-md-3 col-lg-2' styleName='headLight'>
                  <SendTokens />
                </div>
                <div className='col-md-3 col-lg-2' styleName='headDark'>
                  <DepositTokens />
                </div>
              </div>
              {this.props.isVotingFetched && (
                <div className='row'>
                  <div className='col-xs-6'>
                    <Paper>
                      <Voting />
                    </Paper>
                  </div>
                </div>
              )}
              {this.props.rewards.isFetched() && (
                <div className='row'>
                  {this.props.rewards.periods().valueSeq().map((item) => (
                    <div className='col-xs-6' key={item.index()}>
                      <Paper>
                        <Rewards period={item} rewardsData={this.props.rewards} />
                      </Paper>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

