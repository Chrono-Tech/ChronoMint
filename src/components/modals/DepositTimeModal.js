import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dialog, FlatButton, RaisedButton, CircularProgress } from 'material-ui'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import globalStyles from '../../styles'
import DepositTimeForm from '../forms/DepositTime/DepositTimeForm'
import { depositTime, withdrawTime } from '../../redux/wallet/wallet'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  time: state.get('wallet').time,
  isFetching: state.get('wallet').time.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  depositTime: (amount, account) => dispatch(depositTime(amount, account)),
  withdrawTime: (amount, account) => dispatch(withdrawTime(amount, account))
})

@connect(mapStateToProps, mapDispatchToProps)
class DepositTimeModal extends Component {
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
        disabled={!!this.props.isFetching}
      />,
      <RaisedButton
        label='WITHDRAW TOKENS'
        buttonStyle={globalStyles.raisedButton}
        labelStyle={globalStyles.raisedButtonLabel}
        primary
        onTouchTap={this.handleWithdraw}
        disabled={!!this.props.isFetching}
      />,
      <FlatButton
        label='Cancel'
        style={globalStyles.flatButton}
        labelStyle={globalStyles.flatButtonLabel}
        primary
        onTouchTap={this.handleClose}
      />
    ]

    return (
      <Dialog
        actionsContainerStyle={{padding: 26}}
        title={
          <div>
            Deposit and Withdraw Time Tokens
            <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
              <NavigationClose />
            </IconButton>
          </div>
        }
        actions={actions}
        modal={false}
        iconElementRight={<IconButton><NavigationClose /></IconButton>}
        open={open}
        contentStyle={{position: 'relative'}}
      >
        <div style={globalStyles.modalGreyText}>
          Time tokens could be purchased on exchanges, such as Catsrule or Dogsareawesome
          <p><b>Balance: {this.props.time.balance}</b></p>
          <p><b>Deposit: {this.props.time.deposit}</b></p>
        </div>
        {
          this.props.isFetching
            ? <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)', textAlign: 'center'}}>
              <CircularProgress size={24} thickness={1.5} />
              <br />{this.props.isFetching}
            </div>
            : null
        }
        <DepositTimeForm ref='DepositTimeForm' onSubmit={this.handleSubmit} state={this.state} />
      </Dialog>
    )
  }
}

export default DepositTimeModal
