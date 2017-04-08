import {connect} from 'react-redux'
import React, {Component} from 'react'
import {Dialog, FlatButton, RaisedButton} from 'material-ui'
import SendToExchangeForm from '../forms/SendToExchangeForm/'
import {sendLHToExchange} from '../../redux/locs/actions'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const mapStateToProps = state => ({
  account: state.get('session').account
})

const mapDispatchToProps = (dispatch) => ({
  sendLHToExchange: (params) => dispatch(sendLHToExchange(params))
})

@connect(mapStateToProps, mapDispatchToProps)
class SendToExchangeModal extends Component {
  handleSubmit = (values) => {
    const sendAmount = +values.get('sendAmount')
    const account = this.props.account
    return this.props.sendLHToExchange({account, sendAmount})
  };

  handleSubmitClick = () => {
    this.refs.SendToExchangeForm.getWrappedInstance().submit()
  };

  handleClose = () => {
    this.props.hideModal()
  };

  render () {
    const {open, pristine, submitting} = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        style={globalStyles.flatButton}
        labelStyle={globalStyles.flatButtonLabel}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={'SEND LHUS'}
        buttonStyle={globalStyles.raisedButton}
        labelStyle={globalStyles.raisedButtonLabel}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
        disabled={pristine || submitting}
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
        open={open}>
        <SendToExchangeForm ref='SendToExchangeForm' onSubmit={this.handleSubmit} />
      </Dialog>
    )
  }
}

export default SendToExchangeModal
