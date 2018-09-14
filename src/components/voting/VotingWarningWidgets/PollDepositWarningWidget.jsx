/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import { prefix } from './lang'
import './styles.scss'

export default class PollDepositWarningWidget extends PureComponent {
  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='accessDenied'>
            <i className='material-icons' styleName='accessDeniedIcon'>warning</i>
            <Translate value={`${prefix}.warning1`} />
            <Link to='/deposits'><Translate value={`${prefix}.warning2`} /></Link>
            <Translate value={`${prefix}.warning3`} />
          </div>
        </div>
      </div>
    )
  }
}
