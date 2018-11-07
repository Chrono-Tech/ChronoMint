/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Amount from '@chronobank/core/models/Amount'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import { BLOCKCHAIN_ICONS } from 'assets'

import AssetList from '../AssetList'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EthereumAssetListContainer extends PureComponent {
  static propTypes = {
  }

  static defaultProps = {
    assetList: [
      {
        directoryName: 'get started directory',
        directorySVG: BLOCKCHAIN_ICONS[BLOCKCHAIN_ETHEREUM],
        assetList: [
          {
            name: 'LHT',
            iconSVG: BLOCKCHAIN_ICONS[BLOCKCHAIN_ETHEREUM],
            amount: new Amount(Math.random(100, 10000)),
            status: 'active',
            managers: ['safasdf', 'rw23rq23'],
          },
          {
            name: 'RIM',
            iconSVG: BLOCKCHAIN_ICONS[BLOCKCHAIN_ETHEREUM],
            amount: new Amount(Math.random(100, 10000)),
            status: 'blocked',
            managers: ['safasdf'],
          },
        ],
      },
    ],
  }

  render () {
    const blockchainSVG = BLOCKCHAIN_ICONS[BLOCKCHAIN_ETHEREUM]

    return (
      <AssetList
        blockchain={BLOCKCHAIN_ETHEREUM}
        blockchainSVG={blockchainSVG}
        assetList={this.props.assetList}
      />
    )
  }
}
