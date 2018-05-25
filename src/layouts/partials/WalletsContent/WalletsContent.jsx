/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { multisigWalletsSelector } from 'redux/wallet/selectors'
import { WalletWidget } from 'components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MainWalletModel from 'models/wallet/MainWalletModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TwoFAWarningWidget from 'components/wallet/TwoFAWarningWidget/TwoFAWarningWidget'
import './WalletsContent.scss'

const mapStateToProps = (state, ownProps) => {
  return {
    walletsList: multisigWalletsSelector()(state, ownProps),
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletsContent extends Component {
  static propTypes = {
    walletsList: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        address: PropTypes.string,
        wallet: PropTypes.oneOfType([
          PropTypes.instanceOf(MainWalletModel),
          PropTypes.instanceOf(MultisigWalletModel),
        ]),
      }),
    ),
  }

  render () {
    return (
      <div styleName='root'>
        <TwoFAWarningWidget />
        {this.props.walletsList.map((walletGroup) => (
          <div key={walletGroup.title}>
            {walletGroup.data.map((wallet) => (
              <WalletWidget
                key={`${walletGroup.title}-${wallet.address}`}
                blockchain={walletGroup.title}
                address={wallet.address}
                wallet={wallet.wallet}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }
}
