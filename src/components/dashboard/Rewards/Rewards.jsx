import React from 'react'
import PropTypes from 'prop-types'
import { RaisedButton, FloatingActionButton, FontIcon } from 'material-ui'
import RewardsPeriod from 'components/dashboard/RewardsPeriod/RewardsPeriod'
import SplitSection from 'components/dashboard/SplitSection/SplitSection'
import { Link } from 'react-router'

import './Rewards.scss'

class Rewards extends React.Component {

  static propTypes = {
    rewardsData: PropTypes.object,
    period: PropTypes.object
  }

  render () {
    return (
      <div styleName='root'>
        <SplitSection title='Rewards'
          head={(
            <div styleName='title'>
              <h3>Rewards</h3>
            </div>
          )}
          foot={(
            <div styleName='buttons'>
              <RaisedButton
                label='All Periods'
                primary
                containerElement={
                  <Link activeClassName={'active'} to={{ pathname: '/rewards' }} />
                }
              />
            </div>
          )}
          right={(
            <FloatingActionButton>
              <FontIcon className='material-icons'>chevron_right</FontIcon>
            </FloatingActionButton>
          )}
        >
          <RewardsPeriod period={this.props.period} rewardsData={this.props.rewardsData} />
        </SplitSection>
      </div>
    )
  }
}

export default Rewards
