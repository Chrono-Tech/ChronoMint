import RewardsPeriod from 'components/dashboard/RewardsPeriod/RewardsPeriod'
import SplitSection from 'components/dashboard/SplitSection/SplitSection'
import { RaisedButton } from 'material-ui'
import RewardsModel from 'models/rewards/RewardsModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router'

import './Rewards.scss'

function prefix (token) {
  return `Dashboard.Rewards.${token}`
}

class Rewards extends PureComponent {
  static propTypes = {
    rewardsData: PropTypes.instanceOf(RewardsModel),
    period: PropTypes.object,
  }

  render () {
    return (
      <div styleName='root'>
        <SplitSection
          title='Rewards'
          head={(
            <div styleName='title'>
              <h3><Translate value={prefix('title')} /></h3>
            </div>
          )}
          foot={(
            <div styleName='buttons'>
              <RaisedButton
                label={<Translate value={prefix('allPeriods')} />}
                primary
                containerElement={
                  <Link activeClassName='active' to={{ pathname: '/rewards' }} />
                }
              />
            </div>
          )}
        >
          <RewardsPeriod period={this.props.period} rewardsData={this.props.rewardsData} />
        </SplitSection>
      </div>
    )
  }
}

export default Rewards
