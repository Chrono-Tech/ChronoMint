import React from 'react'
import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import RewardsPeriod from 'components/dashboard/RewardsPeriod/RewardsPeriod'
import SplitSection from 'components/dashboard/SplitSection/SplitSection'
import { Link } from 'react-router'
import { Translate } from 'react-redux-i18n'

import './Rewards.scss'

function prefix (token) {
  return 'Dashboard.Rewards.' + token
}

class Rewards extends React.Component {

  static propTypes = {
    rewardsData: PropTypes.object,
    period: PropTypes.object
  }

  render () {
    return (
      <div styleName='root'>
        <SplitSection
          title='Rewards'
          head={(
            <div styleName='title'>
              <h3><Translate value={prefix('title')}/></h3>
            </div>
          )}
          foot={(
            <div styleName='buttons'>
              <RaisedButton
                label={<Translate value={prefix('allPeriods')}/>}
                primary
                containerElement={
                  <Link activeClassName={'active'} to={{pathname: '/rewards'}}/>
                }
              />
            </div>
          )}
        >
          <RewardsPeriod period={this.props.period} rewardsData={this.props.rewardsData}/>
        </SplitSection>
      </div>
    )
  }
}

export default Rewards
