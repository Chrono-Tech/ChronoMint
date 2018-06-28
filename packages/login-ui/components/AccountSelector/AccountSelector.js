/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from 'material-ui'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { UserRow, Button } from 'components'
import { navigateToSelectImportMethod, onWalletSelect } from '@chronobank/login/redux/network/actions'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'

import arrow from 'assets/img/icons/prev-white.svg'
import './AccountSelector.scss'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onWalletSelect: (wallet) => dispatch(onWalletSelect(wallet)),
  }
}

function mapStateToProps (state) {
  return {
    walletsList: state.get('persistAccount').walletsList.map(
      (wallet) => new AccountEntryModel({...wallet})
    ),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SelectWalletPage extends PureComponent {
  static propTypes = {
    onWalletSelect: PropTypes.func,
    walletsList: PropTypes.arrayOf(
      PropTypes.instanceOf(AccountEntryModel)
    ),
    navigateToSelectImportMethod: PropTypes.func,
  }

  static defaultProps = {
    onWalletSelect: () => {},
    walletsList: [],
  }

  renderWalletsList (){
    const { onWalletSelect, walletsList } = this.props

    if (!walletsList || !walletsList.length){
      return (
        <div styleName='empty-list'>
          Sorry, there are no accounts to display
        </div>
      )
    }

    return (
      <div styleName='wallets-list'>
        {
          walletsList ? walletsList.map((w, i) => (
            <UserRow
              key={i}
              title={w.name}
              actionIcon={arrow}
              reverseIcon={true}
              onClick={() => onWalletSelect(w)}
            />
          )) : null
        }
      </div>
    )
  }

  render () {
    return (
      <MuiThemeProvider>
        <div styleName='wrapper'>

          <div styleName='page-title'>My Accounts</div>

          <div styleName='description'>
            Browse account stored on your device.
            <br />
            If you have created an account before you may use Add an Existing Account option below.
          </div>

          <div styleName='content'>
            { this.renderWalletsList() }

            <div styleName='actions'>
              <Button
                styleName='button'
                buttonType='login'
                onClick={this.props.navigateToSelectImportMethod}
              >
                Add an existing account
              </Button>
              or <br />
              <Link to='/login/create-account' href styleName='link'>Create New Account</Link>
            </div>
          </div>

        </div>
      </MuiThemeProvider>
    )
  }
}
