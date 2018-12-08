/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  DEFAULT_ACTIVE_BLOCKCHAINS,
} from '@chronobank/core/redux/persistAccount/constants'
import { modalsClear, modalsClose } from '@chronobank/core/redux/modals/actions'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import { getBlockchainList } from '@chronobank/core/redux/persistAccount/selectors'
import BlockchainChoice from '@chronobank/login-ui/components/BlockchainChoice/BlockchainChoice'
import { updateBlockchainActivity } from '@chronobank/core/redux/persistAccount/actions'

import ModalDialog from '../../dialogs/ModalDialog'

function mapStateToProps (state) {
  const activeList = getBlockchainList(state)
  const initialBlockchains = DEFAULT_ACTIVE_BLOCKCHAINS.reduce((result, item) => {
    result[item] = activeList.includes(item)
    return result
  }, {})
  initialBlockchains[BLOCKCHAIN_ETHEREUM] = true

  return {
    allBlockchainList: DEFAULT_ACTIVE_BLOCKCHAINS,
    initialBlockchains,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClear: () => dispatch(modalsClear()),
    modalsClose: () => dispatch(modalsClose()),
    updateBlockchains: (values) => {
      dispatch(updateBlockchainActivity(values.toJS(), true))
      dispatch(modalsClose())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class BlockchainChoiceModalContainer extends PureComponent {
  static propTypes = {
    updateBlockchains: PropTypes.func,
    allBlockchainList: PropTypes.arrayOf(PropTypes.string),
  }

  render () {
    const { initialBlockchains, updateBlockchains, allBlockchainList } = this.props

    return (
      <ModalDialog>
        <BlockchainChoice
          initialValues={initialBlockchains}
          onHandleSubmitSuccess={updateBlockchains}
          allBlockchainList={allBlockchainList}
          pageType='main'
        />
      </ModalDialog>
    )
  }
}

export default BlockchainChoiceModalContainer
