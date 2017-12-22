import { RewardsPeriod } from 'components'
import styles from 'layouts/partials/styles'
import { FlatButton, Paper, RaisedButton } from 'material-ui'
import Amount from 'models/Amount'
import RewardsModel from 'models/rewards/RewardsModel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router'
import { DUCK_ASSETS_HOLDER } from 'redux/assetsHolder/actions'
import { closePeriod, DUCK_REWARDS, getRewardsData, watchInitRewards, withdrawRevenue } from 'redux/rewards/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import './RewardsContent.scss'

function prefix (token) {
  return `layouts.partials.RewardsContent.${token}`
}

function mapStateToProps (state) {
  const { isCBE } = state.get(DUCK_SESSION)

  return {
    rewards: state.get(DUCK_REWARDS),
    deposit: state.get(DUCK_ASSETS_HOLDER).deposit(),
    isCBE,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getRewardsData: () => dispatch(getRewardsData()),
    watchInitRewards: () => dispatch(watchInitRewards()),
    handleClosePeriod: () => dispatch(closePeriod()),
    handleWithdrawRevenue: () => dispatch(withdrawRevenue()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class RewardsContent extends Component {
  static propTypes = {
    rewards: PropTypes.instanceOf(RewardsModel),
    isCBE: PropTypes.bool,
    deposit: PropTypes.instanceOf(Amount),
    watchInitRewards: PropTypes.func,
    getRewardsData: PropTypes.func,
    handleWithdrawRevenue: PropTypes.func,
    handleClosePeriod: PropTypes.func,
  }

  componentWillMount () {
    if (this.props.rewards.isFetched() || this.props.rewards.isFetching()) {
      return
    }
    this.props.watchInitRewards()
    this.props.getRewardsData()
  }

  renderHead () {
    const { rewards } = this.props

    return (
      <div styleName='head'>
        <h3><Translate value={prefix('rewards')} /></h3>
        <div styleName='headInner'>
          <div className='RewardsContent__grid'>
            <div className='row'>
              <div className='col-sm-1'>
                <div styleName='entry'>
                  <span styleName='entry1'><Translate value={prefix('rewardsSmartContractAddress')} />:</span><br />
                  <span styleName='entry2'>{rewards.address()}</span>
                </div>
                <div styleName='entry'>
                  <span styleName='entry1'><Translate value={prefix('currentRewardsPeriod')} />:</span><br />
                  <span styleName='entry2'>{rewards.lastPeriodIndex()}</span>
                </div>
                <div styleName='entry'>
                  <span styleName='entry1'><Translate value={prefix('periodLength')} />:</span><br />
                  <span styleName='entry2'><Translate value={prefix('daysDays')} days={rewards.periodLength()} /></span>
                </div>
              </div>
              <div className='col-sm-1'>
                <div styleName='alignRight'>
                  <div styleName='entries'>
                    {!this.props.deposit.isZero()
                      ? (
                        <div styleName='entry'>
                          <span styleName='entry1'><Translate value={prefix('rewardsForYourAccountIs')} />:</span><br />
                          <span styleName='entry2'><a styleName='highlightGreen'><Translate value={prefix('enabled')} /></a></span>
                        </div>
                      )
                      : (
                        <div styleName='entry'>
                          <span styleName='entry1'>
                            <Translate value={prefix('youHaveNoTimeDeposit')} /><br />
                            <Translate value={prefix('pleaseDepositTimeTokens')} />
                          </span><br />
                          <span styleName='entry2'><a styleName='highlightRed'><Translate value={prefix('disabled')} /></a></span>
                        </div>
                      )
                    }
                  </div>
                  <div styleName='actions'>
                    <FlatButton
                      style={styles.content.header.link}
                      label={<Translate value={prefix('depositOfWithdrawTime')} />}
                      styleName='action'
                      containerElement={
                        <Link activeClassName='active' to={{ pathname: '/wallet', hash: '#deposit-tokens' }} />
                      }
                    />
                    {rewards.accountRewards().gt(0) && (
                      <RaisedButton
                        label={<Translate value={prefix('withdrawRevenue')} />}
                        styleName='action'
                        disabled={!rewards.accountRewards().gt(0)}
                        onTouchTap={this.props.handleWithdrawRevenue}
                      />
                    )}
                    {this.props.isCBE && (
                      <RaisedButton
                        label={<Translate value={prefix('closePeriod')} />}
                        styleName='action'
                        onTouchTap={this.props.handleClosePeriod}
                      />
                    )}
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
        <div styleName='bodyInner'>
          <div className='RewardsContent__grid'>
            {this.props.rewards.periods().valueSeq().map((item) => (
              <div className='row' key={item.index()}>
                <div className='col-xs-2'>
                  <Paper>
                    <RewardsPeriod period={item} rewardsData={this.props.rewards} />
                  </Paper>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          {this.renderHead()}
          {this.renderBody()}
        </div>
      </div>
    )
  }
}
