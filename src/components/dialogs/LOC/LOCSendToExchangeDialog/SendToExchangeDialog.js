// TODO @dkchv: not finished, blocked by exchange rework
/* eslint-disable */
import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SendToExchangeForm from './SendToExchangeForm'
import { sendLHToExchange } from 'redux/wallet/actions'
import ModalDialogBase from 'components/dialogs/ModalDialogBase/ModalDialogBase'
import { modalsClose } from 'redux/modals/actions'

const mapStateToProps = state => {
  const contractsManagerLHT = state.get('wallet').contractsManagerLHT
  return {
    isFetching: contractsManagerLHT.isFetching,
    isSubmitting: contractsManagerLHT.isSubmitting
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendLHToExchange: (amount) => dispatch(sendLHToExchange(amount)),
  closeModal: () => dispatch(modalsClose())
})

@connect(mapStateToProps, mapDispatchToProps)
class SendToExchangeModal extends Component {
  static propTypes = {
    sendLHToExchange: PropTypes.func
  }

  handleSubmitSuccess = (amount) => {
    this.props.closeModal()
    return this.props.sendLHToExchange(amount)
  }

  render () {
    return (
      <ModalDialogBase title='locs.sendLHToExchange'>
        <SendToExchangeForm
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialogBase>
    )
  }
}

export default SendToExchangeModal
