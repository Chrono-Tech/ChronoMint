import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import globalStyles from '../../styles'
import DepositTimeForm from '../forms/DepositTime/DepositTimeForm'
import { depositTime, withdrawTime, updateTimeBalance, updateTimeDeposit } from '../../redux/wallet/wallet'

const mapStateToProps = (state) => ({
  time: state.get('wallet').time,
  account: state.get('session').account
})

const mapDispatchToProps = (dispatch) => ({
  depositTime: (amount, account) => dispatch(depositTime(amount, account)),
  withdrawTime: (amount, account) => dispatch(withdrawTime(amount, account)),
  updateBalance: (account) => dispatch(updateTimeBalance(account)),
  updateDeposit: (account) => dispatch(updateTimeDeposit(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class DepositTimeModal extends Component {
  componentWillMount () {
    this.props.updateBalance(this.props.account)
    this.props.updateDeposit(this.props.account)
  }

  callback = () => {
  }

  handleSubmit = (values) => {
    const jsValues = values.toJS()
    return this.callback(jsValues.amount, this.props.account)
  }

  handleDeposit = () => {
    this.callback = this.props.depositTime
    this.refs.DepositTimeForm.getWrappedInstance().submit()
  }

  handleWithdraw = () => {
    this.callback = this.props.withdrawTime
    this.refs.DepositTimeForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open} = this.props
    const actions = [
      /*
       <FlatButton
       label="More info"
       style={{...globalStyles.flatButton, float: 'left'}}
       labelStyle={globalStyles.flatButtonLabel}
       primary={true}
       />,
       */
      <RaisedButton
        label='LOCK TOKENS'
        style={{marginRight: 22}}
        buttonStyle={globalStyles.raisedButton}
        labelStyle={globalStyles.raisedButtonLabel}
        primary
        onTouchTap={this.handleDeposit}
      />,
      <RaisedButton
        label='WITHDRAW TOKENS'
        buttonStyle={globalStyles.raisedButton}
        labelStyle={globalStyles.raisedButtonLabel}
        primary
        onTouchTap={this.handleWithdraw}
      />,
      <FlatButton
        label='Cancel'
        style={globalStyles.flatButton}
        labelStyle={globalStyles.flatButtonLabel}
        primary
        onTouchTap={this.props.handleClose}
      />
    ]

    return (
      <Dialog
        actionsContainerStyle={{padding: 26}}
        title={<div>
          Deposit and Withdraw Time Tokens
          <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.props.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        modal={false}
        iconElementRight={<IconButton><NavigationClose /></IconButton>}
        open={open}>
        <div style={globalStyles.modalGreyText}>Time tokens could be purchased on exchanges, such as CatsRule
          or DogsAreAwesome
          <p><b>Balance: {this.props.time.balance}</b></p>
          <p><b>Deposit: {this.props.time.deposit}</b></p>
        </div>
        <DepositTimeForm ref='DepositTimeForm' onSubmit={this.handleSubmit} state={this.state} />
      </Dialog>
    )
  }
}

export default DepositTimeModal
