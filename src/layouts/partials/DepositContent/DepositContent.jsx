/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TIME } from '@chronobank/core/redux/mainWallet/constants'
import { initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { getDeposit } from '@chronobank/core/redux/mainWallet/selectors'
import Amount from '@chronobank/core/models/Amount'
import Deposit from 'components/Deposits/Deposit/Deposit'
import { prefix } from './lang'
import './DepositContent.scss'

function mapStateToProps (state) {
  return {
    deposit: getDeposit(TIME)(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositContent extends Component {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    initAssetsHolder: PropTypes.func,
  }

  componentDidMount () {
    this.props.initAssetsHolder()
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            {this.props.deposit.isZero()
              ? (
                <div styleName='warning'>
                  <Translate value={`${prefix}.warning`} />
                </div>
              )
              : (
                <Deposit />
              )}
          </div>
        </div>
      </div>
    )
  }
}

