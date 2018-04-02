import React, { Component } from 'react'
import AssetManager from 'components/assetsManager/AssetManager/AssetManager'

import './AssetsContent.scss'

export default class AssetsContent extends Component {
  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <div className='AssetsContent__grid'>
              <div className='row'>
                <div className='col-xs-6'>
                  <AssetManager />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
