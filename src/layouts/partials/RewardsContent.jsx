import React, { Component } from 'react'
import { RaisedButton, FlatButton, Paper } from 'material-ui'

import { RewardsPeriod } from 'components'

import styles from 'layouts/partials/styles'

import './RewardsContent.scss'

export default class RewardsContent extends Component {

  render() {
    return (
      <div styleName="root">
        <div styleName="content">
          {this.renderHead()}
          {this.renderBody()}
        </div>
      </div>
    )
  }

  renderHead() {
    return (
      <div styleName="head">
        <h3>Rewards</h3>
        <div styleName="inner">
          <div className="RewardsContent__grid">
            <div className="row">
              <div className="col-xs-1">
                <div styleName="entry">
                  <span styleName="entry1">Rewards smart contract address:</span><br />
                  <span styleName="entry2">0x9876f6477iocc4757q22dfg3333nmk1111v234x0</span>
                </div>
                <div styleName="entry">
                  <span styleName="entry1">Current rewards period:</span><br />
                  <span styleName="entry2">3</span>
                </div>
                <div styleName="entry">
                  <span styleName="entry1">Period length:</span><br />
                  <span styleName="entry2">90 days</span>
                </div>
              </div>
              <div className="col-xs-1">
                <div styleName="alignRight">
                  <div styleName="entry">
                    <span styleName="entry1">Access of rewards contract to your account is:</span><br />
                    <span styleName="entry2"><a styleName="highightGreen">Enabled</a></span>
                  </div>
                  <div styleName="actions">
                    <FlatButton style={styles.content.header.link} label="How it works?" styleName="action" />
                    <RaisedButton label="Disable Access" styleName="action" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBody() {
    return (
      <div styleName="body">
        <div styleName="inner">
          <div className="RewardsContent__grid">
            <div className="row">
              <div className="col-xs-2">
                <Paper style={styles.content.paper.style}>
                  <RewardsPeriod period={3} progress={70} />
                </Paper>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-2">
                <Paper style={styles.content.paper.style}>
                  <RewardsPeriod period={2} progress={100} />
                </Paper>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-2">
                <Paper style={styles.content.paper.style}>
                  <RewardsPeriod period={1} progress={100} />
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
