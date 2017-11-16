import ModalDialog from 'components/dialogs/ModalDialog'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createExchange } from 'redux/exchange/actions'
import { modalsClose } from 'redux/modals/actions'
import AddExchangeForm from './AddExchangeForm'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmitSuccess: (exchange: ExchangeOrderModel) => {
      dispatch(createExchange(exchange))
      dispatch(modalsClose())
    },
  }
}

@connect(null, mapDispatchToProps)
export default class AddExchangeDialog extends PureComponent {
  static propTypes = {
    onSubmitSuccess: PropTypes.func,
    onClose: PropTypes.func,
    closeModal: PropTypes.func,
  }

  render () {
    return (
      <ModalDialog onClose={() => this.props.onClose()}>
        <AddExchangeForm onSubmitSuccess={this.props.onSubmitSuccess} />
      </ModalDialog>
    )
  }
}
