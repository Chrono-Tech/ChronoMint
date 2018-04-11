/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ModalDialog from 'components/dialogs/ModalDialog'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import React, { PureComponent } from 'react'
import { createExchange } from 'redux/exchange/actions'
import { modalsClose } from 'redux/modals/actions'
import AddExchangeForm from './AddExchangeForm'

const onSubmitSuccess = (exchange: ExchangeOrderModel, dispatch) => {
  dispatch(createExchange(exchange))
  dispatch(modalsClose())
}

export default class AddExchangeDialog extends PureComponent {
  render () {
    return (
      <ModalDialog>
        <AddExchangeForm onSubmitSuccess={onSubmitSuccess} />
      </ModalDialog>
    )
  }
}
