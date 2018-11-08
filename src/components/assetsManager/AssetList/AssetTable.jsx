/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AssetRow from './AssetRow'

import './AssetTable.scss'

export default class AssetTable extends PureComponent {
  static propTypes = {
    assetsData: PropTypes.arrayOf(PropTypes.shape(AssetRow.propTypes)),
  }

  render () {
    const { assetsData } = this.props

    return (
      <div styleName='table-container'>
        {assetsData.map((asset) => <AssetRow key={asset.name} {...asset} />)}
      </div>
    )
  }
}
