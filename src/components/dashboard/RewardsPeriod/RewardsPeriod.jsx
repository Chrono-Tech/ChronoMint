/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Moment from 'components/common/Moment'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ProgressSection from 'components/dashboard/ProgressSection/ProgressSection'
import { Paper } from '@material-ui/core'
import Amount from '@chronobank/core/models/Amount'
import { SHORT_DATE } from '@chronobank/core/models/constants'
import RewardsCollection from '@chronobank/core/models/rewards/RewardsCollection'
import RewardsPeriodModel from '@chronobank/core/models/rewards/RewardsPeriodModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_ASSETS_HOLDER } from '@chronobank/core/redux/assetsHolder/constants'
import { DUCK_I18N } from 'redux/i18n/constants'
import { DUCK_REWARDS } from '@chronobank/core/redux/rewards/constants'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import './RewardsPeriod.scss'

function prefix (token) {
  return `components.RewardsPeriod.${token}`
}

function mapStateToProps (state) {
  const rewards = state.get(DUCK_REWARDS)
  // TODO @dkchv: hardcoded to only one asset here
  // const asset = rewards.assets().first(true)
  // const timeToken = state.get(DUCK_TOKENS).item('TIME')
  // const asset = state.get(DUCK_ASSETS_HOLDER).assets.item(timeToken.address())
  const asset = state.get(DUCK_ASSETS_HOLDER).assets().first(true)

  return {
    rewards,
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
    rewards: PropTypes.instanceOf(RewardsCollection),
  }

  componentWillReceiveProps (newProps) {
    moment.locale(newProps.locale)
  }

  render () {
    const { token, deposit } = this.props
    const { period } = this.props

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
                    <span styleName='badgeGreen'><Translate value={prefix('closed')} /></span>
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
                      <span styleName='entry2'><TokenValue bold noRenderPrice value={deposit} />&nbsp;(<Translate value={prefix('percentOfTotalCount')} percent={period.totalDepositPercent(token.totalSupply())} />)</span>
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
                        <TokenValue bold noRenderPrice value={period.userDeposit()} />
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
                    <div><TokenValue value={period.assetBalance()} /></div>
                  </div>
                  <div styleName='row'>
                    <Translate value={prefix('yourApproximateRevenueForPeriod')} />:
                  </div>
                  <div styleName='row'>
                    <div>
                      <TokenValue value={period.userRevenue()} />
                    </div>
                  </div>
                </div>
              </div>
              <div styleName='progress'>
                <ProgressSection value={period.progress()} />
              </div>
            </div>
          </div>
        </div>
      </Paper>
    )
  }
}
