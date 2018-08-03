/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import {
  initAccountsSignature,
} from '@chronobank/login/redux/network/thunks'
import { AccountEntryModel } from '@chronobank/core/models/wallet/persistAccount'
import './AccountSelector.scss'
import {
  navigateToSelectImportMethod,
  navigateToCreateAccount,
} from '../../redux/actions'
import AccountSelector from './AccountSelector'

function mapDispatchToProps (dispatch) {
  return {
    navigateToCreateAccount: () => dispatch(navigateToCreateAccount()),
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    initAccountsSignature: () => dispatch(initAccountsSignature()),
  }
}

function mapStateToProps (state) {
  return {
    walletsList: state.get(DUCK_PERSIST_ACCOUNT).walletsList.map(
      (wallet) => new AccountEntryModel({ ...wallet }),
    ),
  }
}

class AccountSelectorContainer extends PureComponent {
  static propTypes = {
    onWalletSelect: PropTypes.func,
    walletsList: PropTypes.arrayOf(
      PropTypes.instanceOf(AccountEntryModel),
    ),
    navigateToSelectImportMethod: PropTypes.func,
    navigateToCreateAccount: PropTypes.func,
    initAccountsSignature: PropTypes.func,
  }

  static defaultProps = {
    onWalletSelect: () => {
    },
    walletsList: [],
  }

  componentDidMount () {
    this.props.initAccountsSignature()
  }

  render () {
    const {
      navigateToSelectImportMethod,
      navigateToCreateAccount,
      walletsList,
      onWalletSelect,
    } = this.props

    return (
      <AccountSelector
        navigateToSelectImportMethod={navigateToSelectImportMethod}
        navigateToCreateAccount={navigateToCreateAccount}
        walletsList={walletsList}
        onWalletSelect={onWalletSelect}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelectorContainer)
