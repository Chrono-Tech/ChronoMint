import Moment from 'components/common/Moment'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ProgressSection from 'components/dashboard/ProgressSection/ProgressSection'
import { Paper } from 'material-ui'
import Amount from 'models/Amount'
import { SHORT_DATE } from 'models/constants'
import RewardsPeriodModel from 'models/rewards/RewardsPeriodModel'
import TokenModel from 'models/tokens/TokenModel'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_ASSETS_HOLDER } from 'redux/assetsHolder/actions'
import { DUCK_I18N } from 'redux/configureStore'
import { DUCK_REWARDS } from 'redux/rewards/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import './RewardsPeriod.scss'

function prefix (token) {
  return `components.dashboard.RewardsPeriod.${token}`
}

function mapStateToProps (state) {
  // TODO @dkchv: hardcoded to only one asset here
  const asset = state.get(DUCK_REWARDS).assets().first(true)
  return {
    locale: state.get(DUCK_I18N).locale,
    token: state.get(DUCK_TOKENS).getByAddress(asset.id()),
    deposit: state.get(DUCK_ASSETS_HOLDER).assets().item(asset.id()).deposit(),
  }
}

@connect(mapStateToProps)
export default class RewardsPeriod extends PureComponent {
  static propTypes = {
    period: PropTypes.instanceOf(RewardsPeriodModel),
    locale: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    deposit: PropTypes.instanceOf(Amount),
  }

  componentWillReceiveProps (newProps) {
    moment.locale(newProps.locale)
  }

  render () {
    const { token, deposit } = this.props
    // const rewardsData: RewardsModel = this.props.rewardsData
    const { period } = this.props
    const symbol = token.symbol()
    // const isOngoing = period.index() === rewardsData.lastPeriodIndex()
    // const totalDividends = isOngoing
    //   ? rewardsData.rewardsLeft()
    //   : period.assetBalance()
    // const revenue = period.userRevenue(totalDividends)

    const totalDividends = 0
    const revenue = 0
    const isOngoing = true

    let progress = Math.round(100 * (period.daysPassed() / period.periodLength())) || 0
    if (!isFinite(progress) || period.periodLength() === 0) {
      progress = 100
    }

    return (
      <Paper>
        <div styleName='root' className='RewardsPeriod__root'>
          <div styleName='marker' className='RewardsPeriod__marker'>
            <div styleName='number'>#{period.index()}</div>
          </div>
          <div styleName='main' className='RewardsPeriod__main'>
            <div styleName='info'>
              <div styleName='table'>
                <div styleName='col1'>
                  <h5><Translate value={prefix('rewardsPeriodIndex')} index={period.index()} /></h5>
                </div>
                <div styleName='col2'>
                  <div styleName='status'>
                    {isOngoing
                      ? (<span styleName='badgeOrange'><Translate value={prefix('ongoing')} /></span>)
                      : (<span styleName='badgeGreen'><Translate value={prefix('closed')} /></span>)
                    }
                  </div>
                </div>
              </div>
              <div styleName='table'>
                <div styleName='col1'>
                  <div styleName='row'>
                    <span styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('startDate')} />: </span>
                      <span styleName='entry2'><Moment date={period.startDate()} format={SHORT_DATE} /></span>
                    </span>
                    <span styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('endDate')} />: </span>
                        <span styleName='entry2'><Moment date={period.endDate()} format={SHORT_DATE} /> (<Translate
                          value={prefix('inDaysDays')}
                          days={period.daysRemaining()}
                        />)
                      </span>
                  </span>
                  </div>
                  <div styleName='row'>
                    <span styleName='entry' className='RewardsPeriod__entry___flex____column'>
                      <span styleName='entry1'><Translate value={prefix('totalTimeTokensDeposited')} />: </span>
                      <span styleName='entry2'>
                        <TokenValue
                          bold
                          noRenderPrice
                          value={deposit}
                        />
                      &nbsp;(
                      <Translate
                        value={prefix('percentOfTotalCount')}
                        percent={period.totalDepositPercent(token.totalSupply())}
                      />)
                    </span>
                  </span>
                  </div>
                  <div styleName='row'>
                  <span styleName='entry' className='RewardsPeriod__entry___flex____column'>
                    <span styleName='entry1'><Translate value={prefix('uniqueShareholders')} />: </span>
                    <span styleName='entry2'>{period.uniqueShareholders()}</span>
                  </span>
                  </div>
                  <div styleName='row'>
                  <span styleName='entry' className='RewardsPeriod__entry___flex____column'>
                    <span styleName='entry1'><Translate value={prefix('yourTimeTokensEligible')} />: </span>
                    <span styleName='entry2'>
                      {/*<TokenValue*/}
                        {/*bold*/}
                        {/*noRenderPrice*/}
                        {/*value={period.userDeposit()}*/}
                        {/*symbol={symbol}*/}
                      {/*/>*/}
                      &nbsp;(
                      <Translate
                        value={prefix('percentOfTotalDepositedAmount')}
                        percent={period.userDepositPercent()}
                      />)
                    </span>
                  </span>
                  </div>
                </div>
                <div styleName='col2'>
                  <div styleName='row'>
                    <Translate value={prefix('dividendsAccumulatedForPeriod')} />:
                  </div>
                  <div styleName='row'>
                    <div>
                      {/*<TokenValue*/}
                        {/*style={{ fontSize: '24px' }}*/}
                        {/*value={totalDividends}*/}
                        {/*symbol={symbol}*/}
                      {/*/>*/}
                    </div>
                  </div>
                  <div styleName='row'>
                    <Translate value={prefix('yourApproximateRevenueForPeriod')} />:
                  </div>
                  <div styleName='row'>
                    <div>
                      {/*<TokenValue*/}
                        {/*style={{ fontSize: '24px' }}*/}
                        {/*value={revenue}*/}
                        {/*symbol={symbol}*/}
                      {/*/>*/}
                    </div>
                  </div>
                </div>
              </div>
              <div styleName='progress'>
                <ProgressSection value={progress} />
              </div>
            </div>
          </div>
        </div>
      </Paper>
    )
  }
}
