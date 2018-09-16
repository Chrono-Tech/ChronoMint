/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { onWalletSelect } from '@chronobank/login-ui/redux/thunks'
import AccountSelectorContainer from '@chronobank/login-ui/components/AccountSelector/AccountSelectorContainer'

const mapDispatchToProps = (dispatch) => {
  return {
    onWalletSelect: (wallet) => dispatch(onWalletSelect(wallet)),
  }
}

@connect(null, mapDispatchToProps)
export default class AccountSelectorPage extends PureComponent {
  static propTypes = {
    onWalletSelect: PropTypes.func,
  }

  render () {
    return (
      <AccountSelectorContainer onWalletSelect={this.props.onWalletSelect} />
    )
  }
}
