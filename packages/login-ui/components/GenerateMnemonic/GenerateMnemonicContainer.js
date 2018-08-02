/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'

import GenerateMnemonic from './GenerateMnemonic'

export default class GenerateMnemonicContainer extends Component {
  static propTypes = {
    onProceed: PropTypes.func,
  }

  constructor () {
    super()

    this.state = {
      mnemonic: mnemonicProvider.generateMnemonic(),
    }
  }

  onProceed () {
    this.props.onProceed(this.state.mnemonic)
  }

  render () {
    return (
      <GenerateMnemonic
        mnemonic={this.state.mnemonic}
        onProceed={this.onProceed.bind(this)}
      />
    )
  }
}
