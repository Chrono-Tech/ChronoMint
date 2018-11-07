/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AssetTable from './AssetTable'
import AssetRow from './AssetRow'

import './AssetList.scss'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AssetList extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    blockchainSVG: PropTypes.string,
    assetList: PropTypes.arrayOf(PropTypes.shape({
      directoryName: PropTypes.string,
      directorySVG: PropTypes.string,
      assets: PropTypes.arrayOf(AssetRow.propTypes),
    })),
  }

  render () {
    const { blockchain, blockchainSVG, assetList } = this.props
    console.log('assetList: ', assetList)

    return (
      <div styleName='root'>
        <div styleName='container'>
          <div styleName='header'>
            <div styleName='header-text-container'>
              <span styleName='header-text'>{blockchain}</span>
            </div>
            <div styleName='header-icon-container'>
              <img styleName='blockchain-icon' src={blockchainSVG} alt='blockchain-icon' />
            </div>
          </div>
          <div styleName='body'>
            {assetList.map(({ directoryName, directorySVG, assetList }) => (
              <div styleName='main-info-container' key={directoryName}>
                {directorySVG &&
                <div styleName='directory'>
                  <img styleName='directory-icon' src={directorySVG} />
                </div>}
                <div styleName='asset-info'>
                  {directoryName &&
                  <div styleName='directory-name'>
                    <span styleName='directory-name-text'>{directoryName}</span>
                  </div>}
                  <div styleName='assets-table'>
                    <AssetTable assetsData={assetList} />
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    )
  }
}
