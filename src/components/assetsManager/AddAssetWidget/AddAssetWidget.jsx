/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { change, formValueSelector } from 'redux-form/immutable'
import { resetAssetsForm } from 'redux/ui/thunks'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import { FORM_ADD_NEW_ASSET } from '@chronobank/core/redux/assetsManager/constants'
import WidgetContainer from 'components/WidgetContainer/WidgetContainer'
import SelectAssetType from './SelectAssetType/SelectAssetType'
import AddEthereumAssetForm from '../AddEthereumAssetForm/AddEthereumAssetForm'

import { prefix } from './lang'
import './AddAssetWidget.scss'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_ADD_NEW_ASSET)
  return {
    blockchain: selector(state, 'blockchain'),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectAssetBlockchain: (blockchain: string) => {
      dispatch(change(FORM_ADD_NEW_ASSET, 'blockchain', blockchain))
    },
    reset: () => dispatch(resetAssetsForm()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddAssetWidget extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    selectAssetBlockchain: PropTypes.func,
    reset: PropTypes.func,
  }

  componentWillUnmount () {
    this.props.reset()
  }

  onSelectAssetBlockchain = (blockchain: string) => {
    this.props.selectAssetBlockchain(blockchain)
  }

  renderStep () {
    const { blockchain } = this.props

    if (blockchain) {
      switch (blockchain) {
        case BLOCKCHAIN_ETHEREUM:
          return (
            <WidgetContainer title={`${prefix}.createEthereumAsset`} blockchain={BLOCKCHAIN_ETHEREUM}>
              <AddEthereumAssetForm handleTouchTap={this.onSelectWalletType} />
            </WidgetContainer>
          )
      }
    }

    return (
      <WidgetContainer title={`${prefix}.addAsset`}>
        <SelectAssetType handleTouchTap={this.onSelectAssetBlockchain} />
      </WidgetContainer>
    )
  }

  render () {
    return (
      <div styleName='root'>
        {this.renderStep()}
      </div>
    )
  }
}
