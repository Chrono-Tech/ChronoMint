/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import AssetManager from 'components/assetsManager/AssetManager/AssetManager'

import './AssetsContent.scss'

export default class AssetsContent extends Component {
  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <AssetManager />
          </div>
        </div>
      </div>
    )
  }
}
