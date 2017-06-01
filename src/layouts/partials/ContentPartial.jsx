import React from 'react'

import { Paper } from 'material-ui'

import { SendTokens, DepositTokens, Rewards, Voting } from '@/components'

import styles from './styles'
import './ContentPartial.scss'

export default class ContentPartial extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        <div styleName="row">
          <div styleName="container">
            <div styleName="block">
              <Paper style={styles.content.paper.style}>
                <SendTokens title="Send tokens" headStyle={{ background: '#5c6bc0' }} />
              </Paper>
            </div>
            <div styleName="block">
              <Paper style={styles.content.paper.style}>
                <SendTokens title="Send tokens" headStyle={{ background: '#05326a' }} />
              </Paper>
            </div>
            <div styleName="block">
              <Paper style={styles.content.paper.style}>
                <DepositTokens title="Deposit time" headStyle={{ background: '#05326a' }} />
              </Paper>
            </div>
          </div>
          <div styleName="container">
            <div styleName="block2">
              <Paper style={styles.content.paper.style}>
                <Rewards period={3} progress={70} />
              </Paper>
            </div>
            <div styleName="block2">
              <Paper style={styles.content.paper.style}>
                <Rewards period={2} progress={100} />
              </Paper>
            </div>
            <div styleName="block2">
              <Paper style={styles.content.paper.style}>
                <Rewards period={1} progress={30} />
              </Paper>
            </div>
            <div styleName="block2">
              <Paper style={styles.content.paper.style}>
                <Voting />
              </Paper>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
