import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper } from 'material-ui'
import { SendTokens, DepositTokens, Rewards, Voting } from 'components'

import { getRewardsData, watchInitRewards } from 'redux/rewards/rewards'

import styles from 'layouts/partials/styles'

import './DashboardContent.scss'

export class DashboardContent extends Component {

  static propTypes = {
    ready: PropTypes.bool,
    rewardsData: PropTypes.object,
    isRewardsFetched: PropTypes.bool,

    watchInitRewards: PropTypes.func,
    getRewardsData: PropTypes.func,
  }

  componentWillMount () {
    if (!this.props.isRewardsFetched) {
      this.props.watchInitRewards()
      this.props.getRewardsData()
    }
  }

  render () {
    return !this.props.ready ? null : (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <div className='DashboardContent__grid'>
              <div className='row'>
                <div className='col-md-3 col-lg-2' styleName='head-light'>
                  <Paper style={styles.content.paper.style}>
                    <SendTokens title='Send tokens' />
                  </Paper>
                </div>
                <div className='col-md-3 col-lg-2' styleName='head-dark'>
                  <Paper style={styles.content.paper.style}>
                    <SendTokens title='Send tokens' />
                  </Paper>
                </div>
                <div className='col-md-3 col-lg-2' styleName='head-dark'>
                  <Paper style={styles.content.paper.style}>
                    <DepositTokens title='Deposit time' />
                  </Paper>
                </div>
              </div>
              {!this.props.isRewardsFetched
                ? null
                : (
                  <div className='row'>
                    {this.props.rewardsData.periods().valueSeq().map((item) => (
                      <div className='col-xs-6' key={item.index()}>
                        <Paper style={styles.content.paper.style}>
                          <Rewards period={item} rewardsData={this.props.rewardsData} />
                        </Paper>
                      </div>
                    ))}
                  </div>
                )
              }
              <div className='row'>
                <div className='col-xs-6'>
                  <Paper style={styles.content.paper.style}>
                    <Voting />
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const wallet = state.get('wallet')
  const rewards = state.get('rewards')
  return {
    ready: !wallet.tokensFetching,
    rewardsData: rewards.data,
    isRewardsFetched: rewards.isFetched
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getRewardsData: () => dispatch(getRewardsData()),
    watchInitRewards: () => dispatch(watchInitRewards())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent)
