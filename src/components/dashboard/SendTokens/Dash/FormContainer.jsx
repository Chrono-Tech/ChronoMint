/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { connect } from 'react-redux'
import { estimateFee } from '@chronobank/core/redux/dash/thunks'

import FormContainer from '../BitcoinLikeBockchain/FormContainer'
import BitcoinLikeBlockchainForm, { mapStateToProps } from '../BitcoinLikeBockchain/Form'

function mapDispatchToProps (dispatch) {
  return {
    estimateFee: (params) => dispatch(estimateFee(params)),
  }
}

const Form = connect(mapStateToProps, mapDispatchToProps)(BitcoinLikeBlockchainForm)

const bitcoinFormContainer = (props) => (
  <FormContainer {...props} form={Form} />
)

export default bitcoinFormContainer
