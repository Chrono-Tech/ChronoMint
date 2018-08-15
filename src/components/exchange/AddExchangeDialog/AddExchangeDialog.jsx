/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import ModalDialog from 'components/dialogs/ModalDialog'
import ExchangeOrderModel from '@chronobank/core/models/exchange/ExchangeOrderModel'
import React, { PureComponent } from 'react'
import { createExchange } from '@chronobank/core/redux/exchange/actions'
import { modalsClose } from 'redux/modals/actions'
import AddExchangeForm, { prefix } from './AddExchangeForm'

const onSubmitSuccess = (exchange: ExchangeOrderModel, dispatch) => {
  dispatch(createExchange(exchange))
  dispatch(modalsClose())
}

export default class AddExchangeDialog extends PureComponent {
  render () {
    return (
      <ModalDialog title={<Translate value={prefix('dialogTitle')} />}>
        <AddExchangeForm onSubmitSuccess={onSubmitSuccess} />
      </ModalDialog>
    )
  }
}
