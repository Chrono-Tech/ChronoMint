/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import WalletsContent from 'layouts/partials/WalletsContent/WalletsContent'
import React, { Component } from 'react'

import './WalletPage.scss'

export default class WalletsPage extends Component {
  render () {
    return (
      <div styleName="root">
        <WalletsContent />
      </div>
    )
  }
}
