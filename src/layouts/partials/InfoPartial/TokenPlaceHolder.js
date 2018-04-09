/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Paper } from 'material-ui'
import React, { PureComponent } from 'react'
import './TokenPlaceHolder.scss'

export default class TokenPlaceHolder extends PureComponent {
  render () {
    return (
      <div styleName='root'>
        <Paper zDepth={1} style={{ background: 'transparent' }}>
          <div styleName='content'>
            <div styleName='icon' />
            <div styleName='name' />
          </div>
          <div styleName='balance'>
            <div styleName='amount' />
            <div styleName='amount' />
          </div>
        </Paper>
      </div>
    )
  }
}
