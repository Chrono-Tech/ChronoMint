import React from 'react'
import PropTypes from 'prop-types'

import { RaisedButton, FloatingActionButton, FontIcon, FlatButton } from 'material-ui'

import SplitSection from './SplitSection'
import ProgressSection from './ProgressSection'

import './Rewards.scss'

class Rewards extends React.Component {

  constructor(props) {
    super(props)
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
          <div styleName="content">
            <div styleName="marker">
              <div styleName="number">#{this.props.period}</div>
            </div>
            <div styleName="main">
              <div styleName="info">
                <h5>Rewards period #{this.props.period}</h5>
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
        </SplitSection>
      </div>
    )
  }
}

Rewards.propTypes = {
  period: PropTypes.number,
  progress:  PropTypes.number,
}

Rewards.defaultProps = {
  period: 1,
  progress: 0
}

export default Rewards
