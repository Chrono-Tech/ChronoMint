/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from '@material-ui/core'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import React, { Component } from 'react'
import Button from 'components/common/ui/Button/Button'
import { downloadWallet } from '@chronobank/core/redux/persistAccount/actions'
import { navigateToLoginPage } from '../../redux/actions'

import Wallet from 'assets/img/icons/wallet-white.svg'

import './GenerateWallet.scss'

function mapDispatchToProps (dispatch) {
  return {
    downloadWallet: () => dispatch(downloadWallet()),
    navigateToLoginPage: () => dispatch(navigateToLoginPage()),
  }
}

@connect(null, mapDispatchToProps)
export default class MnemonicPage extends Component {
  static propTypes = {
    downloadWallet: PropTypes.func,
    navigateToLoginPage: PropTypes.func,
  }

  render () {
    const { downloadWallet, navigateToLoginPage } = this.props

    return (
      <div styleName='wrapper'>
        <div>
          <div styleName='page-title'>
            <Translate value='GenerateWallet.title' />
          </div>

          <p styleName='description'>
            <Translate value='GenerateWallet.description' />
          </p>

          <div styleName='actions'>
            <Button
              styleName='button'
              onClick={downloadWallet}
            >
              <img src={Wallet} alt='' />
              <br />
              <Translate value='GenerateWallet.download' />
            </Button>

            <Button
              styleName='submit'
              buttonType='login'
              onClick={navigateToLoginPage}
            >
              <Translate value='GenerateWallet.finish' />
            </Button>
          </div>

          <div styleName='progress-block'>
            <div styleName='progress-point' />
            <div styleName='progress-point' />
            <div styleName='progress-point' />
          </div>
        </div>
      </div>
    )
  }
}
