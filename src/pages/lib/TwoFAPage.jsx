/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TwoFAContent from 'layouts/partials/TwoFAContent/TwoFAContent'
import React, { Component } from 'react'

import './WalletPage.scss'

export default class TwoFAPage extends Component {
  render () {
    return (
      <div styleName="root">
        <TwoFAContent />
      </div>
    )
  }
}
