import { Paper } from 'material-ui'
import React, { Component } from 'react'
import { Tokens, CBEAddresses } from 'components'
import styles from 'layouts/partials/styles'

import './SettingsContent.scss'

export default class SettingsContent extends Component {
  render() {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='column'>
            <Paper style={styles.content.paper.style}>
              <Tokens />
            </Paper>
          </div>
          <div styleName='column'>
            <Paper style={styles.content.paper.style}>
              <CBEAddresses />
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}

