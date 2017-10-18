import { Operations } from 'components'
import { Paper } from 'material-ui'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import styles from 'layouts/partials/styles'

import '../SettingsContent/SettingsContent.scss'

function prefix(token) {
  return `layouts.partials.OperationsContent.${token}`
}

export default class SettingsContent extends Component {
  render() {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='column'>
            <Paper style={styles.content.paper.style}>
              <Operations title={<Translate value={prefix('pendingOperations')} />} showSignatures filterOperations={o => !o.isDone()} />
            </Paper>
          </div>
          <div styleName='column'>
            <Paper style={styles.content.paper.style}>
              <Operations title={<Translate value={prefix('completedOperations')} />} showSignatures={false} filterOperations={o => o.isDone()} />
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}

