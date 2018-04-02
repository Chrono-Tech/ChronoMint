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
