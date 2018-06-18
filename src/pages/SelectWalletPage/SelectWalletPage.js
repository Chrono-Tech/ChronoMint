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
  WalletEntryModel,
} from 'models/persistWallet'

import arrow from 'assets/img/icons/prev-white.svg'
import './SelectWalletPage.scss'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onWalletSelect: (wallet) => dispatch(onWalletSelect(wallet)),
  }
}

function mapStateToProps (state) {
  return {
    walletsList: state.get('persistWallet').walletsList,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SelectWalletPage extends PureComponent {
  static propTypes = {
    onWalletSelect: PropTypes.func,
    walletsList: PropTypes.arrayOf(
      PropTypes.instanceOf(WalletEntryModel)
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
            <Link to='/create-account' href styleName='link'>Create New Account</Link>
          </div>

        </div>
      </MuiThemeProvider>
    )
  }
}
