import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router'

import { RaisedButton, FlatButton, Paper, CircularProgress } from 'material-ui'
import { RewardsPeriod } from 'components'

import type RewardsModel from 'models/RewardsModel'

import { getRewardsData, watchInitRewards, withdrawRevenue, closePeriod } from 'redux/rewards/rewards'

import styles from 'layouts/partials/styles'

import './RewardsContent.scss'

function prefix (token) {
  return 'layouts.partials.RewardsContent.' + token
}

@connect(mapStateToProps, mapDispatchToProps)
export default class RewardsContent extends Component {

  static propTypes = {
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    isCBE: PropTypes.bool,

    rewardsData: PropTypes.object,
    timeDeposit: PropTypes.object,

    watchInitRewards: PropTypes.func,
    getRewardsData: PropTypes.func,
    handleWithdrawRevenue: PropTypes.func,
    handleClosePeriod: PropTypes.func
  }

  componentWillMount () {

    if (!this.props.isFetched) {
      this.props.watchInitRewards()
    }

    if (!this.props.isFetching) {
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
    const rewardsData: RewardsModel = this.props.rewardsData
    return (
      <div styleName='head'>
        <h3>Rewards</h3>
        <div styleName='inner'>
          <div className='RewardsContent__grid'>
            <div className='row'>
              <div className='col-sm-1'>
                <div styleName='entry'>
                  <span styleName='entry1'><Translate value={prefix('rewardsSmartContractAddress')} />:</span><br />
                  <span styleName='entry2'>{rewardsData.address()}</span>
                </div>
                <div styleName='entry'>
                  <span styleName='entry1'><Translate value={prefix('currentRewardsPeriod')} />:</span><br />
                  <span styleName='entry2'>{rewardsData.lastPeriodIndex()}</span>
                </div>
                <div styleName='entry'>
                  <span styleName='entry1'><Translate value={prefix('periodLengt')} />:</span><br />
                  <span styleName='entry2'>{rewardsData.periodLength()} days</span>
                </div>
              </div>
              <div className='col-sm-1'>
                <div styleName='alignRight'>
                  <div styleName='entries'>
                    {/*
                    <div styleName='entry'>
                      <span styleName='entry1'>Access of rewards contract to your account is:</span><br />
                      <span styleName='entry2'><a styleName='highlightGreen'>Enabled</a></span>
                    </div>
                    */}
                    {this.props.timeDeposit && this.props.timeDeposit.gt(0)
                      ? <div styleName='entry'>
                        <span styleName='entry1'>
                          <span><Translate value={prefix('rewardsForYourAccountIs')} />:</span>
                        </span><br />
                        <span styleName='entry2'>
                          <a styleName='highlightGreen'><Translate value={prefix('enabled')} /></a>
                        </span>
                      </div>
                      : (
                        <div styleName='entry'>
                          <span styleName='entry1'>
                            <span><Translate value={prefix('youHaveNoTimeDeposit')} /></span><br />
                            <span><Translate value={prefix('pleaseDepositTimeTokens')} /></span>
                          </span><br />
                          <span styleName='entry2'>
                            <a styleName='highlightRed'><Translate value={prefix('disabled')} /></a>
                          </span>
                        </div>
                      )
                    }
                  </div>
                  <div styleName='actions'>
                    <FlatButton
                      style={styles.content.header.link}
                      label='Deposit Or Withdraw Time'
                      styleName='action'
                      containerElement={
                        <Link activeClassName={'active'} to={{ pathname: '/wallet', hash: '#deposit-tokens' }} />
                      }
                    />
                    {rewardsData.accountRewards().gt(0)
                      ? (<RaisedButton
                        label='Withdraw Revenue'
                        styleName='action'
                        disabled={!rewardsData.accountRewards().gt(0)}
                        onTouchTap={() => this.props.handleWithdrawRevenue()}
                      />)
                      : null
                    }
                    {this.props.isCBE
                      ? (<RaisedButton
                        label='Close period'
                        styleName='action'
                        onTouchTap={() => this.props.handleClosePeriod()}
                      />)
                      : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBody () {
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
  const rewards = state.get('rewards')
  const session = state.get('session')
  const wallet = state.get('wallet')

  return {
    rewardsData: rewards.data,
    // just to subscribe RewardsContent on time deposit updates
    timeDeposit: wallet.timeDeposit,
    isFetching: rewards.isFetching,
    isFetched: rewards.isFetched,
    isCBE: session.isCBE
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getRewardsData: () => dispatch(getRewardsData()),
    watchInitRewards: () => dispatch(watchInitRewards()),
    handleClosePeriod: () => dispatch(closePeriod()),
    handleWithdrawRevenue: () => dispatch(withdrawRevenue())
  }
}
