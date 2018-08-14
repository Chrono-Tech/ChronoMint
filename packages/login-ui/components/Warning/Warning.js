/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'

import './Warning.scss'

export default class Warning extends PureComponent {
  render () {
    return (
      <div styleName='warningBox'>
        <div styleName='warningIcon'>
          <i className='chronobank-icon'>warning</i>
        </div>
        <div styleName='warningText'><Translate value='Warning.text' dangerousHTML /></div>
      </div>
    )
  }
}
