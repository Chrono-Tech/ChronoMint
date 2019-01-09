/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import { DEFAULT_ACTIVE_BLOCKCHAINS } from '@chronobank/core/redux/persistAccount/constants'
import BlockchainChoice from './BlockchainChoice'

import './BlockchainChoice.scss'

function mapStateToProps (ownState, ownProps) {
  console.log('ownProps: ', ownProps.activeBlockchainList, ownProps)
  const blockchainList = ownProps.activeBlockchainList || DEFAULT_ACTIVE_BLOCKCHAINS
  const initialBlockchains = blockchainList.reduce((result, item) => {
    result[item] = true
    return result
  }, {})
  initialBlockchains[BLOCKCHAIN_ETHEREUM] = true

  return {
    allBlockchainList: ownProps.activeBlockchainList || DEFAULT_ACTIVE_BLOCKCHAINS,
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
    activeBlockchainList: PropTypes.arrayOf(PropTypes.string),
  }

  handleSubmitSuccess = async (blockchainValuesList) => {
    this.props.onSubmitSuccess(blockchainValuesList)
  }

  render () {
    const { initialBlockchains, allBlockchainList } = this.props

    return (
      <div styleName='container-root'>
        <BlockchainChoice
          initialValues={initialBlockchains}
          onHandleSubmitSuccess={this.handleSubmitSuccess}
          allBlockchainList={allBlockchainList}
          navigateToSelectWallet={this.props.navigateToSelectWallet}
          pageType='login'
        />
      </div>
    )
  }
}

export default BlockchainChoiceContainer
