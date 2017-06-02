import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'
import globalStyles from '../../styles'
import DepositTIMEForm from '../forms/DepositTIMEForm'
import { depositTIME, withdrawTIME, updateTIMEBalance, updateTIMEDeposit, TIME } from '../../redux/wallet/actions'
import ModalBase from './ModalBase/ModalBase'
import { Translate } from 'react-redux-i18n'

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
        label={<Translate value='terms.cancel' />}
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
      <ModalBase
        title='Deposit or Withdraw TIME Tokens'
        onClose={this.handleClose}
        actions={actions}
        modal={false}
        open={open}
      >
        <div style={globalStyles.greyText}>
          TIME tokens could be purchased on exchanges, such as CatsRule or DogsAreAwesome
          <p><b>Balance: {this.props.time.balance()}</b></p>
          <p><b>Deposit: {this.props.timeDeposit}</b></p>
        </div>
        <DepositTIMEForm ref='DepositTIMEForm' onSubmit={this.handleSubmit} state={this.state} />
      </ModalBase>
    )
  }
}

export default DepositTIMEModal
