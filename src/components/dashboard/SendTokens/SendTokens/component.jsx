/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ModalDialog from 'components/dialogs/ModalDialog'
import PropTypes from 'prop-types'
import React from 'react'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { MultisigEthWalletModel } from '@chronobank/core/models'

import { getForm } from './FormFactory'

const SendTokens = (props) => {
  const { isModal, token } = props
  const Wrapper = isModal ? ModalDialog : 'div'
  const SendTokenForm = getForm(token.blockchain())

  return (
    <Wrapper>
      <SendTokenForm {...props} />
    </Wrapper>
  )
}

SendTokens.propTypes = {
  wallet: PropTypes.oneOfType([PropTypes.instanceOf(WalletModel), PropTypes.instanceOf(MultisigEthWalletModel)]),
  isModal: PropTypes.bool,
  tokenSymbol: PropTypes.string.isRequired,
  token: PropTypes.instanceOf(TokenModel),
}

export default SendTokens
