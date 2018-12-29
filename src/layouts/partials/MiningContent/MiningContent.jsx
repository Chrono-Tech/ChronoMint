/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import LaborXConnectWidget from 'components/Deposits/LaborXConnectWidget/LaborXConnectWidget'
import LaborXRewardsWidget from 'components/dashboard/LaborXRewardsWidget/LaborXRewardsWidget'
import { updateTimeHolderBalances } from '@chronobank/core/redux/laborHour/thunks/transactions'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import './MiningContent.scss'

function mapDispatchToProps (dispatch) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    initLXTimeHolder: () => dispatch(updateTimeHolderBalances()),
    addDeposit: (props) =>
      dispatch(
        modalsOpen({
          componentName: 'DepositTokensModal',
          props,
        })
      ),
  }
}

@connect( null, mapDispatchToProps)
export default class MiningContent extends Component {
  static propTypes = {
    initAssetsHolder: PropTypes.func,
    initLXTimeHolder: PropTypes.func,
    addDeposit: PropTypes.func,
    wallet: PropTypes.instanceOf(WalletModel),
  }

  componentDidMount () {
    this.props.initAssetsHolder()
    this.props.initLXTimeHolder()
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <LaborXConnectWidget />
            <LaborXRewardsWidget />
          </div>
        </div>
      </div>
    )
  }
}
