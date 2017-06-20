import React from 'react'
import PropTypes from 'prop-types'
import { FlatButton } from 'material-ui'
import ProgressSection from './ProgressSection'
import './RewardsPeriod.scss'

export default class RewardsPeriod extends React.Component {

  static propTypes = {
    period: PropTypes.number,
    progress:  PropTypes.number
  }

  render() {
    return (
      <div styleName="root" className="RewardsPeriod__root">
        <div styleName="marker" className="RewardsPeriod__marker">
          <div styleName="number">#{this.props.period}</div>
        </div>
        <div styleName="main" className="RewardsPeriod__main">
          <div styleName="info">
            <div styleName="table">
              <div styleName="col1">
                <h5>Rewards period #{this.props.period}</h5>
              </div>
              <div styleName="col2">
                <div styleName="status">
                  <span styleName="badgeOrange">Ongoing</span>
                </div>
              </div>
            </div>
            <div styleName="table">
              <div styleName="col1">
                <div styleName="row">
                  <span styleName="entry">
                    <span styleName="entry1">Start date: </span>
                    <span styleName="entry2">20 May 2017</span>
                  </span>
                  <span styleName="entry">
                    <span styleName="entry1">End date: </span>
                    <span styleName="entry2">11 July 2017 (in 45 days)</span>
                  </span>
                </div>
                <div styleName="row">
                  <span styleName="entry">
                    <span styleName="entry1">Total TIME tokens deposited: </span><br />
                    <span styleName="entry2">68 120 TIME (77% of total count)</span>
                  </span>
                </div>
                <div styleName="row">
                  <span styleName="entry">
                    <span styleName="entry1">Unique shareholders</span><br />
                    <span styleName="entry2">45 713</span>
                  </span>
                </div>
                <div styleName="row">
                  <span styleName="entry">
                    <span styleName="entry1">Your TIME tokens eligible for rewards in the period:</span><br />
                    <span styleName="entry2">1 120 TIME (2.45455544% of total deposited amount)</span>
                  </span>
                </div>
              </div>
              <div styleName="col2">
                <div styleName="row">
                  Dividends accumulated for period:
                </div>
                <div styleName="row">
                  <div>
                    <span styleName="value">
                      <span styleName="value1">1 512 000</span>
                      <span styleName="value2">.00124 LHUS</span>
                    </span>
                  </div>
                  <div>
                    <span styleName="value">
                      <span styleName="value1">1 512 000</span>
                      <span styleName="value2">.00124 LHAU</span>
                    </span>
                  </div>
                  <div>
                    <span styleName="value">
                      <span styleName="value1">1 512 000</span>
                      <span styleName="value2">.00124 LHEU</span>
                    </span>
                  </div>
                </div>
                <div styleName="row">
                  Your approximate revenue for period:
                </div>
                <div styleName="row">
                  <div>
                    <span styleName="value">
                      <span styleName="value1">1 512 000</span>
                      <span styleName="value2">.00124 LHUS</span>
                    </span>
                  </div>
                  <div>
                    <span styleName="value">
                      <span styleName="value1">1 512 000</span>
                      <span styleName="value2">.00124 LHAU</span>
                    </span>
                  </div>
                  <div>
                    <span styleName="value">
                      <span styleName="value1">1 512 000</span>
                      <span styleName="value2">.00124 LHEU</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div styleName="progress">
              <ProgressSection value={this.props.progress} />
            </div>
            <div styleName="links">
              <FlatButton label="Withdraw time tokens" primary />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
