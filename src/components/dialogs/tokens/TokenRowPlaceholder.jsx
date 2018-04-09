/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import './TokenRowPlaceholder.scss'

export default class TokenRowPlaceholder extends PureComponent {
  render () {
    return (
      <div styleName='root'>
        <div styleName='icon' />
        <div styleName='info'>
          <div styleName='name' />
          <div styleName='balance' />
        </div>
      </div>
    )
  }
}
