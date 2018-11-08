/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import AddAssetWidget from 'components/assetsManager/AddAssetWidget/AddAssetWidget'

import './AddAssetContent.scss'

export default class AddAssetContent extends Component {
  render () {
    return (
      <div styleName='root'>
        <AddAssetWidget />
      </div>
    )
  }
}
