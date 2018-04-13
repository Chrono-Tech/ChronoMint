/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TIME } from 'redux/mainWallet/actions'
import { initAssetsHolder } from 'redux/assetsHolder/actions'
import { getDeposit } from 'redux/mainWallet/selectors'
import Amount from 'models/Amount'
import DepositsList from 'components/Deposits/DepositsList/DepositsList'
import { Button } from 'components'
import { prefix } from './lang'
import './DepositsContent.scss'

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
export default class DepositsContent extends Component {
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
            <Button styleName='addDepositButton'>
              Add deposit
            </Button>
            {this.props.deposit.isZero()
              ? (
                <div styleName='warning'>
                  <Translate value={`${prefix}.warning`} />
                </div>
              )
              : (
                <DepositsList />
              )}
          </div>
        </div>
      </div>
    )
  }
}

