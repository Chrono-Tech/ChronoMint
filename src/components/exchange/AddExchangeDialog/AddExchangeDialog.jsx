import { Translate } from 'react-redux-i18n'
import ModalDialog from 'components/dialogs/ModalDialog'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import React, { PureComponent } from 'react'
import { createExchange } from 'redux/exchange/actions'
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
