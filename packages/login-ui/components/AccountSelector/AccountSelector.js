/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from 'material-ui'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { UserRow, Button } from 'components'
import {
  navigateToSelectImportMethod,
  onWalletSelect,
  initAccountsSignature,
  initAccountsSelector,
} from '@chronobank/login/redux/network/actions'
import {
  getAccountName,
  getAccountAvatar,
} from '@chronobank/core/redux/persistAccount/utils'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'

import arrow from 'assets/img/icons/prev-white.svg'
import './AccountSelector.scss'

function mapDispatchToProps (dispatch) {
  return {
    navigateToSelectImportMethod: () => dispatch(navigateToSelectImportMethod()),
    onWalletSelect: (wallet) => dispatch(onWalletSelect(wallet)),
    initAccountsSignature: () => dispatch(initAccountsSignature()),
    initAccountsSelector: () => dispatch(initAccountsSelector()),
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
    initAccountsSignature: PropTypes.func,
    initAccountsSelector: PropTypes.func,
  }

  static defaultProps = {
    onWalletSelect: () => {},
    walletsList: [],
  }

  componentDidMount(){
    this.props.initAccountsSelector()
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
              title={getAccountName(w)}
              avatar={getAccountAvatar(w)}
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

          <div styleName='page-title'>
            <Translate value='AccountSelector.title' />
          </div>

          <div styleName='description'>
            <Translate value='AccountSelector.description' />
            <br />
            <Translate value='AccountSelector.descriptionExtra' />
          </div>

          <div styleName='content'>
            { this.renderWalletsList() }

            <div styleName='actions'>
              <Button
                styleName='button'
                buttonType='login'
                onClick={this.props.navigateToSelectImportMethod}
              >
                <Translate value='AccountSelector.button' />
              </Button>
              or <br />
              <Link to='/login/create-account' href styleName='link'>
                <Translate value='AccountSelector.createAccount' />
              </Link>
            </div>
          </div>

        </div>
      </MuiThemeProvider>
    )
  }
}
