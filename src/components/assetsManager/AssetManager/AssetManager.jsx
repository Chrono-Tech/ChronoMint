/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import EthereumContainer from '../AssetList/containers/EthereumContainer'

import './AssetManager.scss'

export default class AssetManager extends PureComponent {

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <EthereumContainer />
        </div>
      </div>
    )
  }
}
