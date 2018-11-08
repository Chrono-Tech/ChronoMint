/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { change, formValueSelector } from 'redux-form/immutable'
import { resetWalletsForm } from 'redux/ui/thunks'
import { FORM_ADD_NEW_ASSET } from '@chronobank/core/redux/assetsManager/constants'
import WidgetContainer from 'components/WidgetContainer/WidgetContainer'
import SelectAssetType from './SelectAssetType/SelectAssetType'

import { prefix } from './lang'

import './AddAssetWidget.scss'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_ADD_NEW_ASSET)
  return {
    blockchain: selector(state, 'blockchain'),
    ethWalletType: selector(state, 'ethWalletType'),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectWalletBlockchain: (blockchain: string) => {
      dispatch(change(FORM_ADD_NEW_ASSET, 'blockchain', blockchain))
    },
    reset: () => dispatch(resetWalletsForm()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddAssetWidget extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    ethWalletType: PropTypes.string,
    selectWalletBlockchain: PropTypes.func,
    selectWalletType: PropTypes.func,
    reset: PropTypes.func,
  }

  componentWillUnmount () {
    this.props.reset()
  }

  onSelectWalletBlockchain = (blockchain: string) => {
    this.props.selectWalletBlockchain(blockchain)
  }

  onSelectWalletType = (type: string) => {
    this.props.selectWalletType(type)
  }

  renderStep () {
    return (
      <WidgetContainer title={`${prefix}.addWallet`}>
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
