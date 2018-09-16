/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  downloadWallet,
  accountDeselect,
} from '@chronobank/core/redux/persistAccount/actions'
import {
  navigateToSelectWallet,
} from '@chronobank/login-ui/redux/navigation'
import GenerateWallet from './GenerateWallet'

const mapDispatchToProps = (dispatch) => {
  return {
    downloadWallet: () => dispatch(downloadWallet()),
    onContinue: () => {
      dispatch(accountDeselect())
      dispatch(navigateToSelectWallet())
    },
  }
}

@connect(null, mapDispatchToProps)
export default class GenerateWalletContainer extends Component {
  static propTypes = {
    downloadWallet: PropTypes.func,
    onContinue: PropTypes.func,
  }

  render () {
    const { downloadWallet, onContinue } = this.props

    return (
      <GenerateWallet
        downloadWallet={downloadWallet}
        onContinue={onContinue}
      />
    )
  }
}
