import RewardsCollection from '@/models/rewards/RewardsCollection'
import { DepositTokens, Rewards, SendTokens, Voting } from 'components'
import RewardsModel from 'models/rewards/RewardsModel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DUCK_REWARDS, initRewards } from 'redux/rewards/actions'
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
    initRewards: () => dispatch(initRewards()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DashboardContent extends Component {
  static propTypes = {
    rewards: PropTypes.instanceOf(RewardsCollection),
    isVotingFetched: PropTypes.bool,
    initRewards: PropTypes.func,
  }

  componentWillMount () {
    this.props.initRewards()
  }

  render () {
    const { rewards } = this.props

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
                    <Voting />
                  </div>
                </div>
              )}
              {rewards.isFetched() && (
                <div className='row'>
                  {rewards.items().map((item) => (
                    <div className='col-xs-6' key={item.index()}>
                      <Rewards period={item} />
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

