/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { prefix } from './lang'
import './styles.scss'

export default class EmptyWarningWidget extends PureComponent {
  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='accessDenied'>
            <Translate value={`${prefix}.emptyList`} />
          </div>
        </div>
      </div>
    )
  }
}
