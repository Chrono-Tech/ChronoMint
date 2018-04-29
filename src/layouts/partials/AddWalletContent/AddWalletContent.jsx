/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import AddWalletWidget from 'components/wallet/AddWalletWidget/AddWalletWidget'

import './AddWalletContent.scss'

export default class AddWalletContent extends Component {
  render () {
    return (
      <div styleName='root'>
        <AddWalletWidget />
      </div>
    )
  }
}
