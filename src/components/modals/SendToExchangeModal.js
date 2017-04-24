import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Dialog, FlatButton, RaisedButton, CircularProgress } from 'material-ui'
import SendToExchangeForm from '../forms/SendToExchangeForm'
import { sendLHToExchange } from '../../redux/wallet/actions'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const mapStateToProps = state => {
  const contractsManagerLHT = state.get('wallet').contractsManagerLHT
  return {
    account: state.get('session').account,
    isFetching: contractsManagerLHT.isFetching,
    isSubmitting: contractsManagerLHT.isSubmitting
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendLHToExchange: (params) => dispatch(sendLHToExchange(params))
})

@connect(mapStateToProps, mapDispatchToProps)
class SendToExchangeModal extends Component {
  handleSubmit = (values) => {
    const sendAmount = +values.get('sendAmount')
    const account = this.props.account
    return this.props.sendLHToExchange({account, sendAmount})
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
        label={'SEND LHT'}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
        disabled={pristine || isFetching || isSubmitting}
      />
    ]

    return (
      <Dialog
        title={<div>
          Send LH to Exchange
          <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={{padding: 26}}
        titleStyle={{paddingBottom: 10}}
        modal
        open={open}
        contentStyle={{position: 'relative'}}
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
            <br />{ isFetching ? 'Updating' : 'Submitting' }
          </div>
          : null}
      </Dialog>
    )
  }
}

export default SendToExchangeModal
