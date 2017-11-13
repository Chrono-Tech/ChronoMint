import { Paper } from 'material-ui'
import React, { Component } from 'react'
import { Tokens, CBEAddresses } from 'components'

import './SettingsContent.scss'

export default class SettingsContent extends Component {
  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='column'>
            <Paper>
              <Tokens />
            </Paper>
          </div>
          <div styleName='column'>
            <Paper>
              <CBEAddresses />
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}
