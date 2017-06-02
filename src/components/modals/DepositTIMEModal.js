import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import globalStyles from '../../styles'
import DepositTIMEForm from '../forms/DepositTIMEForm'
import { depositTIME, withdrawTIME, updateTIMEBalance, updateTIMEDeposit, TIME } from '../../redux/wallet/actions'

const styles = {
  actionBtn: {
    marginLeft: 20,
    marginBottom: 10
  }
}

const mapStateToProps = (state) => ({
  time: state.get('wallet').tokens.get(TIME),
  timeDeposit: state.get('wallet').timeDeposit,
  isFetching: state.get('wallet').tokens.get(TIME).isFetching()
})

const mapDispatchToProps = (dispatch) => ({
  depositTime: (amount) => dispatch(depositTIME(amount)),
  withdrawTime: (amount) => dispatch(withdrawTIME(amount)),
  updateBalance: () => dispatch(updateTIMEBalance()),
  updateDeposit: () => dispatch(updateTIMEDeposit())
})

@connect(mapStateToProps, mapDispatchToProps)
class DepositTIMEModal extends Component {
  componentWillMount () {
    this.props.updateBalance()
    this.props.updateDeposit()
  }

  callback = () => {
  }

  handleSubmit = (values) => {
    const jsValues = values.toJS()
    return this.callback(jsValues.amount)
  }

  handleDeposit = () => {
    this.callback = this.props.depositTime
    this.refs.DepositTIMEForm.getWrappedInstance().submit()
  }

  handleWithdraw = () => {
    this.callback = this.props.withdrawTime
    this.refs.DepositTIMEForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open} = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        style={styles.actionBtn}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label='WITHDRAW TOKENS'
        style={styles.actionBtn}
        primary
        onTouchTap={this.handleWithdraw}
        disabled={!!this.props.isFetching}
      />,
      <RaisedButton
        label='LOCK TOKENS'
        style={styles.actionBtn}
        primary
        onTouchTap={this.handleDeposit}
        disabled={!!this.props.isFetching}
      />
    ]

    return (
      <Dialog
        actionsContainerStyle={{padding: 26}}
        title={
          <div>
            Deposit or Withdraw TIME Tokens
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
          TIME tokens could be purchased on exchanges, such as CatsRule or DogsAreAwesome
          <p><b>Balance: {this.props.time.balance()}</b></p>
          <p><b>Deposit: {this.props.timeDeposit}</b></p>
        </div>
        <DepositTIMEForm ref='DepositTIMEForm' onSubmit={this.handleSubmit} state={this.state} />
      </Dialog>
    )
  }
}

export default DepositTIMEModal
