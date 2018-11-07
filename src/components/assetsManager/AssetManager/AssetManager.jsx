/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import EthereumContainer from '../AssetList/containers/EthereumContainer'

import './AssetManager.scss'

function mapStateToProps (state) {
  return {

  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AssetManager extends PureComponent {
  static propTypes = {

  }

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
