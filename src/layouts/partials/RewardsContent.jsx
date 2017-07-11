import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { RaisedButton, FlatButton, Paper, CircularProgress } from 'material-ui'
import { RewardsPeriod } from 'components'

import { getRewardsData, withdrawRevenue, closePeriod, watchInitRewards } from 'redux/rewards/rewards'

import styles from 'layouts/partials/styles'

import './RewardsContent.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class RewardsContent extends Component {

  static propTypes = {
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,

    rewardsData: PropTypes.object,

    watchInitRewards: PropTypes.func,
    getRewardsData: PropTypes.func
  }

  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.watchInitRewards()
      this.props.getRewardsData()
    }
  }

  render () {
    return !this.props.isFetched
      ? (<div styleName='progress'><CircularProgress size={24} thickness={1.5} /></div>)
      : (
        <div styleName='root'>
          <div styleName='content'>
            {this.renderHead()}
            {this.renderBody()}
          </div>
        </div>
      )
  }

  renderHead () {
    return (
      <div styleName='head'>
        <h3>Rewards</h3>
        <div styleName='inner'>
          <div className='RewardsContent__grid'>
            <div className='row'>
              <div className='col-xs-1'>
                <div styleName='entry'>
                  <span styleName='entry1'>Rewards smart contract address:</span><br />
                  <span styleName='entry2'>{this.props.rewardsData.address()}</span>
                </div>
                <div styleName='entry'>
                  <span styleName='entry1'>Current rewards period:</span><br />
                  <span styleName='entry2'>{this.props.rewardsData.lastPeriodIndex()}</span>
                </div>
                <div styleName='entry'>
                  <span styleName='entry1'>Period length:</span><br />
                  <span styleName='entry2'>{this.props.rewardsData.periodLength()} days</span>
                </div>
              </div>
              <div className='col-xs-1'>
                <div styleName='alignRight'>
                  <div styleName='entry'>
                    <span styleName='entry1'>Access of rewards contract to your account is:</span><br />
                    <span styleName='entry2'><a styleName='highightGreen'>Enabled</a></span>
                  </div>
                  <div styleName='actions'>
                    <FlatButton style={styles.content.header.link} label='How it works?' styleName='action' />
                    <RaisedButton label='Disable Access' styleName='action' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBody() {

    return (
      <div styleName='body'>
        <div styleName='inner'>
          <div className='RewardsContent__grid'>
            {this.props.rewardsData.periods().valueSeq().map((item) => (
              <div className='row' key={item.index()}>
                <div className='col-xs-2'>
                  <Paper style={styles.content.paper.style}>
                    <RewardsPeriod period={item} rewardsData={this.props.rewardsData} />
                  </Paper>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    rewardsData: state.get('rewards').data,
    isFetching: state.get('rewards').isFetching,
    isFetched: state.get('rewards').isFetched
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getRewardsData: () => dispatch(getRewardsData()),
    handleWithdrawRevenue: () => dispatch(withdrawRevenue()),
    handleClosePeriod: () => dispatch(closePeriod()),
    watchInitRewards: () => dispatch(watchInitRewards())
  }
}
