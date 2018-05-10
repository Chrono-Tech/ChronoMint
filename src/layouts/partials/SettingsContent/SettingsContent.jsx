/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

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
