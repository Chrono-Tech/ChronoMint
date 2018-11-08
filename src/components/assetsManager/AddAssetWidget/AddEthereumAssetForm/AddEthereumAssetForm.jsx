/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import './AddEthereumAssetForm.scss'

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddEthereumAssetForm extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    selectAssetBlockchain: PropTypes.func,
    reset: PropTypes.func,
  }

  render () {
    return (
      <div styleName='root'>
        <span>AddEthereumAssetForm</span>
      </div>
    )
  }
}
