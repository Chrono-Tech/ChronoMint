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
    onWalletSelect: () => {},
    walletsList: [],
  }

  renderUserRow = (w, i, handleUserRowClick) => (
    <UserRow
      key={i}
      title={getAccountName(w)}
      subtitle={getAccountAddress(w, true)}
      avatar={getAccountAvatar(w)}
      actionIcon={arrow}
      reverseIcon
      onClick={handleUserRowClick}
    />
  )

  renderEmptyWalletsList = () => (
    <div styleName='empty-list'>
      <Translate value='AccountSelector.emptyList' />
    </div>
  )

  renderWalletsList = () => {
    console.log('renderWalletsList')
    const { onWalletSelect, walletsList } = this.props

    if (!walletsList || walletsList.length === 0) {
      console.log('renderEmptyWalletsList')
      return this.renderEmptyWalletsList()
    }

    console.log('walletsList.map')
    return walletsList.map((w, i) => {
      const handleUserRowClick = () => onWalletSelect(w)
      return this.renderUserRow(w, i, handleUserRowClick)
    })
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
          <div styleName='wallets-list'>
            {
              this.renderWalletsList()
            }
          </div>

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
