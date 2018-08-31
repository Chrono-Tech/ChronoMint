/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'

import GenerateMnemonic from './GenerateMnemonic'

export default class GenerateMnemonicContainer extends Component {
  static propTypes = {
    onProceed: PropTypes.func,
    mnemonic: PropTypes.string,
  }

  render () {
    return (
      <GenerateMnemonic
        mnemonic={this.props.mnemonic}
        onProceed={this.props.onProceed}
      />
    )
  }
}
