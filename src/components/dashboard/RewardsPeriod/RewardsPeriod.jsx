import React from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import moment from 'moment'

import ProgressSection from 'components/dashboard/ProgressSection/ProgressSection'
import TokenValue from 'components/common/TokenValue/TokenValue'

import { TIME } from 'redux/wallet/actions'

import './RewardsPeriod.scss'
import Moment, { SHORT_DATE } from 'components/common/Moment'

function prefix (token) {
  return 'components.dashboard.RewardsPeriod.' + token
}

function mapStateToProps (state) {
  return {
    locale: state.get('i18n').locale
  }
}

@connect(mapStateToProps)
export default class RewardsPeriod extends React.Component {

  static propTypes = {
    rewardsData: PropTypes.object,
    period: PropTypes.object,
    locale: PropTypes.string
  }

  componentWillReceiveProps (newProps) {
    moment.locale(newProps.locale)
  }

  render () {

    const rewardsData = this.props.rewardsData
    const period = this.props.period
    const symbol = rewardsData.symbol()
    const isOngoing = period.index() === rewardsData.lastPeriodIndex()
    const totalDividends = isOngoing
      ? rewardsData.currentAccumulated()
      : period.assetBalance()
    const revenue = period.userRevenue(totalDividends)

    let progress = Math.round(100 * (period.daysPassed() / period.periodLength())) || 0
    if (!isFinite(progress) || period.periodLength() === 0) {
      progress = 100
    }

    return (
      <div styleName='root' className='RewardsPeriod__root'>
        <div styleName='marker' className='RewardsPeriod__marker'>
          <div styleName='number'>#{period.index()}</div>
        </div>
        <div styleName='main' className='RewardsPeriod__main'>
          <div styleName='info'>
            <div styleName='table'>
              <div styleName='col1'>
                <h5><Translate value={prefix('rewardsPeriodIndex')} index={period.index()}/></h5>
              </div>
              <div styleName='col2'>
                <div styleName='status'>
                  {isOngoing
                    ? (<span styleName='badgeOrange'><Translate value={prefix('ongoing')}/></span>)
                    : (<span styleName='badgeGreen'><Translate value={prefix('closed')}/></span>)
                  }
                </div>
              </div>
            </div>
            <div styleName='table'>
              <div styleName='col1'>
                <div styleName='row'>
                  <span styleName='entry'>
                    <span styleName='entry1'><Translate value={prefix('startDate')}/>: </span>
                    <span styleName='entry2'><Moment date={period.startDate()} format={SHORT_DATE}/></span>
                  </span>
                  <span styleName='entry'>
                    <span styleName='entry1'><Translate value={prefix('endDate')}/>: </span>
                    <span styleName='entry2'><Moment date={period.endDate()} format={SHORT_DATE}/> (<Translate
                      value={prefix('inDaysDays')}
                      days={period.daysRemaining()}/>)</span>
                  </span>
                </div>
                <div styleName='row'>
                  <span styleName='entry' className='RewardsPeriod__entry___flex____column'>
                    <span styleName='entry1'><Translate value={prefix('totalTimeTokensDeposited')}/>: </span>
                    <span styleName='entry2'>
                      <TokenValue
                        bold={true}
                        noRenderPrice={true}
                        value={period.totalDeposit()}
                        symbol={TIME}/>
                      &nbsp;(
                      <Translate
                        value={prefix('percentOfTotalCount')}
                        percent={period.totalDepositPercent(rewardsData.timeTotalSupply())}/>)
                    </span>
                  </span>
                </div>
                <div styleName='row'>
                  <span styleName='entry' className='RewardsPeriod__entry___flex____column'>
                    <span styleName='entry1'><Translate value={prefix('uniqueShareholders')}/>: </span>
                    <span styleName='entry2'>{period.uniqueShareholders()}</span>
                  </span>
                </div>
                <div styleName='row'>
                  <span styleName='entry' className='RewardsPeriod__entry___flex____column'>
                    <span styleName='entry1'><Translate value={prefix('yourTimeTokensEligible')}/>: </span>
                    <span styleName='entry2'>
                      <TokenValue
                        bold={true}
                        noRenderPrice={true}
                        value={period.userDeposit()}
                        symbol={TIME}/>
                      &nbsp;(
                      <Translate
                        value={prefix('percentOfTotalDepositedAmount')}
                        percent={period.userDepositPercent()}/>)
                    </span>
                  </span>
                </div>
              </div>
              <div styleName='col2'>
                <div styleName='row'>
                  <Translate value={prefix('dividendsAccumulatedForPeriod')}/>:
                </div>
                <div styleName='row'>
                  <div>
                    <TokenValue
                      style={{fontSize: '24px'}}
                      value={totalDividends}
                      symbol={symbol}
                    />
                  </div>
                </div>
                <div styleName='row'>
                  <Translate value={prefix('yourApproximateRevenueForPeriod')}/>:
                </div>
                <div styleName='row'>
                  <div>
                    <TokenValue
                      style={{fontSize: '24px'}}
                      value={revenue}
                      symbol={symbol}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div styleName='progress'>
              <ProgressSection value={progress}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
