import React from 'react'
import PropTypes from 'prop-types'
import { FlatButton } from 'material-ui'
import ProgressSection from './ProgressSection'
import './RewardsPeriod.scss'

export default class RewardsPeriod extends React.Component {

  static propTypes = {
    rewardsData: PropTypes.object,
    period: PropTypes.object
  }

  render() {

    const rewardsData = this.props.rewardsData
    const period = this.props.period
    const isOngoing = period.index() === rewardsData.lastPeriodIndex()
    const progress = Math.round(100 * (period.daysPassed() / period.periodLength())) || 0

    return (
      <div styleName='root' className='RewardsPeriod__root'>
        <div styleName='marker' className='RewardsPeriod__marker'>
          <div styleName='number'>#{period.index()}</div>
        </div>
        <div styleName='main' className='RewardsPeriod__main'>
          <div styleName='info'>
            <div styleName='table'>
              <div styleName='col1'>
                <h5>Rewards period #{period.index()}</h5>
              </div>
              <div styleName='col2'>
                <div styleName='status'>
                  {isOngoing
                    ? (<span styleName='badgeOrange'>Ongoing</span>)
                    : (<span styleName='badgeGreen'>Closed</span>)
                  }
                </div>
              </div>
            </div>
            <div styleName='table'>
              <div styleName='col1'>
                <div styleName='row'>
                  <span styleName='entry'>
                    <span styleName='entry1'>Start date: </span>
                    <span styleName='entry2'>{period.startDate()}</span>
                  </span>
                  <span styleName='entry'>
                    <span styleName='entry1'>End date: </span>
                    <span styleName='entry2'>{period.endDate()} (in {period.daysRemaining()} days)</span>
                  </span>
                </div>
                <div styleName='row'>
                  <span styleName='entry'>
                    <span styleName='entry1'>Total TIME tokens deposited: </span><br />
                    <span styleName='entry2'>{period.totalDeposit()} TIME ({period.totalDepositPercent(rewardsData.timeTotalSupply())}% of total count)</span>
                  </span>
                </div>
                <div styleName='row'>
                  <span styleName='entry'>
                    <span styleName='entry1'>Unique shareholders</span><br />
                    <span styleName='entry2'>{period.uniqueShareholders()}</span>
                  </span>
                </div>
                <div styleName='row'>
                  <span styleName='entry'>
                    <span styleName='entry1'>Your TIME tokens eligible for rewards in the period:</span><br />
                    <span styleName='entry2'>{period.userDeposit()} TIME ({period.userDepositPercent()}% of total deposited amount)</span>
                  </span>
                </div>
              </div>
              <div styleName='col2'>
                <div styleName='row'>
                  Dividends accumulated for period:
                </div>
                <div styleName='row'>
                  <div>
                    <span styleName='value'>
                      <span styleName='value1'>1 512 000</span>
                      <span styleName='value2'>.00124 LHUS</span>
                    </span>
                  </div>
                  <div>
                    <span styleName='value'>
                      <span styleName='value1'>1 512 000</span>
                      <span styleName='value2'>.00124 LHAU</span>
                    </span>
                  </div>
                  <div>
                    <span styleName='value'>
                      <span styleName='value1'>1 512 000</span>
                      <span styleName='value2'>.00124 LHEU</span>
                    </span>
                  </div>
                </div>
                <div styleName='row'>
                  Your approximate revenue for period:
                </div>
                <div styleName='row'>
                  <div>
                    <span styleName='value'>
                      <span styleName='value1'>1 512 000</span>
                      <span styleName='value2'>.00124 LHUS</span>
                    </span>
                  </div>
                  <div>
                    <span styleName='value'>
                      <span styleName='value1'>1 512 000</span>
                      <span styleName='value2'>.00124 LHAU</span>
                    </span>
                  </div>
                  <div>
                    <span styleName='value'>
                      <span styleName='value1'>1 512 000</span>
                      <span styleName='value2'>.00124 LHEU</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div styleName='progress'>
              <ProgressSection value={progress} />
            </div>
            <div styleName='links'>
              <FlatButton label='Withdraw time tokens' primary />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
