import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper } from 'material-ui'
import { SendTokens, DepositTokens, Rewards, Voting } from 'components'

import styles from 'layouts/partials/styles'

import './DashboardContent.scss'

export class DashboardContent extends Component {

  static propTypes = {
    ready: PropTypes.bool,
  }

  render() {
    return !this.props.ready ? null : (
      <div styleName="root">
        <div styleName="content">
          <div styleName="inner">
            <div className="DashboardContent__grid">
              <div className="row">
                <div className="col-md-3 col-lg-2" styleName="head-light">
                  <Paper style={styles.content.paper.style}>
                    <SendTokens title="Send tokens" />
                  </Paper>
                </div>
                <div className="col-md-3 col-lg-2" styleName="head-dark">
                  <Paper style={styles.content.paper.style}>
                    <SendTokens title="Send tokens" />
                  </Paper>
                </div>
                <div className="col-md-3 col-lg-2" styleName="head-dark">
                  <Paper style={styles.content.paper.style}>
                    <DepositTokens title="Deposit time" />
                  </Paper>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <Paper style={styles.content.paper.style}>
                    <Rewards period={3} progress={70} />
                  </Paper>
                </div>
                <div className="col-xs-6">
                  <Paper style={styles.content.paper.style}>
                    <Rewards period={2} progress={100} />
                  </Paper>
                </div>
                <div className="col-xs-6">
                  <Paper style={styles.content.paper.style}>
                    <Rewards period={1} progress={30} />
                  </Paper>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <Paper style={styles.content.paper.style}>
                    <Voting />
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps (state) {
  const wallet = state.get('wallet')
  return {
    ready: !wallet.tokensFetching,
  }
}

export default connect(mapStateToProps)(DashboardContent)
