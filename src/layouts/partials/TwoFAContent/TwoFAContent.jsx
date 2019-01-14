/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import TwoFaEnableForm from 'components/wallet/TwoFaEnableForm/TwoFaEnableForm'
import './TwoFAContent.scss'

export default class TwoFAContent extends Component {
  static propTypes = {}

  render () {
    return (
      <div styleName='root'>
        <TwoFaEnableForm />
      </div>
    )
  }
}
