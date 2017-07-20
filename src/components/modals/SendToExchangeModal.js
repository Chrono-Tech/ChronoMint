// TODO finish LOC
/* eslint-disable */
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { FlatButton, RaisedButton, CircularProgress } from 'material-ui'
import SendToExchangeForm from '../forms/SendToExchangeForm'
import { sendLHToExchange } from '../../redux/wallet/actions'
import ModalBase from './ModalBase/ModalBase'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = state => {
  const contractsManagerLHT = state.get('wallet').contractsManagerLHT
  return {
    isFetching: contractsManagerLHT.isFetching,
    isSubmitting: contractsManagerLHT.isSubmitting
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendLHToExchange: (amount) => dispatch(sendLHToExchange(amount))
})

@connect(mapStateToProps, mapDispatchToProps)
class SendToExchangeModal extends Component {
  handleSubmit = (values) => {
    return this.props.sendLHToExchange(+values.get('sendAmount'))
  }

  handleSubmitClick = () => {
    this.refs.SendToExchangeForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open, pristine, isFetching, isSubmitting} = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={<Translate value='sendS' s='LHT' />}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
        disabled={pristine || isFetching || isSubmitting}
      />
    ]

    return (
      <ModalBase
        title='locs.sendLHToExchange'
        onClose={this.handleClose}
        actions={actions}
        open={open}
      >
        <SendToExchangeForm ref='SendToExchangeForm' onSubmit={this.handleSubmit} />

        {isFetching || isSubmitting
          ? <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            textAlign: 'center'
          }}>
            <CircularProgress size={24} thickness={1.5} />
            <br />{isFetching ? 'Updating' : 'Submitting'}
          </div>
          : null}
      </ModalBase>
    )
  }
}

export default SendToExchangeModal
