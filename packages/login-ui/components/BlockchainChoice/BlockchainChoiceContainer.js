/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DEFAULT_ACTIVE_BLOCKCHAINS } from '@chronobank/core/redux/persistAccount/constants'
import BlockchainChoice from './BlockchainChoice'

function mapStateToProps () {
  const initialBlockchains = DEFAULT_ACTIVE_BLOCKCHAINS.reduce((result, item) => {
    result[item] = true
    return result
  }, {})

  return {
    allBlockchainList: DEFAULT_ACTIVE_BLOCKCHAINS,
    initialBlockchains,
  }
}

@connect(mapStateToProps, null)
class BlockchainChoiceContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    updateBlockchainsList: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
    allBlockchainList: PropTypes.arrayOf(PropTypes.string),
  }

  handleSubmitSuccess = async (blockchainValuesList) => {
    this.props.onSubmitSuccess(blockchainValuesList)
  }

  render () {
    const { initialBlockchains, allBlockchainList } = this.props

    return (
      <BlockchainChoice
        initialValues={initialBlockchains}
        onHandleSubmitSuccess={this.handleSubmitSuccess}
        allBlockchainList={allBlockchainList}
        navigateToSelectWallet={this.props.navigateToSelectWallet}
      />
    )
  }
}

export default BlockchainChoiceContainer
