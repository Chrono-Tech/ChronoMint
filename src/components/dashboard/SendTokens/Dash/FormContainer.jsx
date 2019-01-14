/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { connect } from 'react-redux'

import FormContainer, { mapStateToProps, mapDispatchToProps } from '../AbstractBitcoin/FormContainer'
import Form from './Form'

class DashFormContainer extends FormContainer {
  getAdvancedParams (formFields) {
    const params = super.getAdvancedParams(formFields)
    params.instantSend = formFields.instantSend
    return params
  }
}

const DashConnectedFormContainer = connect(mapStateToProps, mapDispatchToProps)(DashFormContainer)

const DashFormWrapper = (props) => (
  <DashConnectedFormContainer {...props} form={Form} />
)

export default DashFormWrapper
