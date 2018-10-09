/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import BlockchainsSwitch from './BlockchainsSwitch'

class BlockchainsSwitchContainer extends PureComponent {
  render () {
    return (
      <BlockchainsSwitch />
    )
  }
}

export default connect()(BlockchainsSwitchContainer)
