/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import Button from 'components/common/ui/Button/Button'
import {
  getAccountAddress,
  getAccountAvatar,
  getAccountName,
} from '@chronobank/core/redux/persistAccount/utils'
import { AccountEntryModel } from '@chronobank/core/models/wallet/persistAccount'
import arrow from 'assets/img/icons/prev-white.svg'
import UserRow from '../UserRow/UserRow'
import './AccountSelector.scss'

export default class AccountSelector extends PureComponent {
  static propTypes = {
    onWalletSelect: PropTypes.func,
    walletsList: PropTypes.arrayOf(
      PropTypes.instanceOf(AccountEntryModel),
    ),
    navigateToSelectImportMethod: PropTypes.func,
    navigateToCreateAccount: PropTypes.func,
  }

  static defaultProps = {
    onWalletSelect: () => {
    },
    walletsList: [],
  }

  handleWalletSelect = (wallet) => () => {
    this.props.onWalletSelect(wallet)
  }

  renderWalletsList () {
    const { walletsList } = this.props

    if (!walletsList || !walletsList.length) {
      return (
        <div styleName='empty-list'>
          <Translate value='AccountSelector.emptyList' />
        </div>
      )
    }

    return (
      <div styleName='wallets-list'>
        {
          walletsList.map((wallet) => (
            <UserRow
              key={wallet.key}
              title={getAccountName(wallet)}
              subtitle={getAccountAddress(wallet, true)}
              avatar={getAccountAvatar(wallet)}
              actionIcon={arrow}
              reverseIcon
              onClick={this.handleWalletSelect(wallet)}
            />
          ))
        }
      </div>
    )
  }

  render () {
    const { navigateToCreateAccount, navigateToSelectImportMethod } = this.props

    return (
      <div styleName='wrapper'>

        <div styleName='page-title'>
          <Translate value='AccountSelector.title' />
        </div>

        <div styleName='description'>
          <Translate value='AccountSelector.description' />
          <br />
          <Translate value='AccountSelector.descriptionExtra' />
        </div>

        <div styleName='content'>
          {this.renderWalletsList()}

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              onClick={navigateToSelectImportMethod}
            >
              <Translate value='AccountSelector.button' />
            </Button>
            <Translate value='AccountSelector.or' />
            &nbsp;<br />
            <button onClick={navigateToCreateAccount} styleName='link'>
              <Translate value='AccountSelector.createAccount' />
            </button>
          </div>
        </div>

      </div>
    )
  }
}
