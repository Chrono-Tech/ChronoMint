import React, { Component } from 'react'
import { Paper } from 'material-ui'

import { Operations } from 'components'

import styles from 'layouts/partials/styles'
import './SettingsContent.scss'

export default class SettingsContent extends Component {

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='column'>
            <Paper style={styles.content.paper.style}>
              <Operations title='Pending operations' showSignatures={true} filterOperations={(o) => !o.isDone()} />
            </Paper>
          </div>
          <div styleName='column'>
            <Paper style={styles.content.paper.style}>
              <Operations title='Completed operations' showSignatures={false} filterOperations={(o) => o.isDone()} />
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}
