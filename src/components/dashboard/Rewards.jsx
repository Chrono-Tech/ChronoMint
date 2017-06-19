import React from 'react'
import PropTypes from 'prop-types'
import { RaisedButton, FloatingActionButton, FontIcon } from 'material-ui'
import RewardsPeriod from './RewardsPeriod'
import SplitSection from './SplitSection'
import './Rewards.scss'

class Rewards extends React.Component {

  static propTypes = {
    period: PropTypes.number,
    progress:  PropTypes.number,
  }

  static defaultProps = {
    period: 1,
    progress: 0
  }

  render() {
    return (
      <div styleName="root">
        <SplitSection title="Rewards"
          head={(
            <div styleName="title">
              <h3>Rewards</h3>
            </div>
          )}
          foot={(
            <div styleName="buttons">
              <RaisedButton label="All Periods" primary />
            </div>
          )}
          right={(
            <FloatingActionButton>
              <FontIcon className="material-icons">chevron_right</FontIcon>
            </FloatingActionButton>
          )}
        >
          <RewardsPeriod period={this.props.period} progress={this.props.period} />
        </SplitSection>
      </div>
    )
  }
}

export default Rewards
