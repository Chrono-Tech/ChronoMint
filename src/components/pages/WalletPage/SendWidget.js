import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  Divider
} from 'material-ui'
import SendForm from '../../forms/wallet/SendForm'
import globalStyles from '../../../styles'
import {
  resetSendForm,
  transferETH,
  transferLHT,
  transferTIME
} from '../../../redux/wallet/actions'
import { Translate } from 'react-redux-i18n'

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = (dispatch) => ({
  transferETH: (amount, recipient) => dispatch(transferETH(amount, recipient)),
  transferLHT: (amount, recipient) => dispatch(transferLHT(amount, recipient)),
  transferTIME: (amount, recipient) => dispatch(transferTIME(amount, recipient)),
  resetSendForm: () => dispatch(resetSendForm())
})

@connect(null, mapDispatchToProps)
class SendWidget extends Component {
  handleSubmit = (values) => {
    this.transferTokens(
      values.get('currency'),
      values.get('amount'),
      values.get('recipient')
    ).then(() => {
      this.props.resetSendForm()
    })
  }

  transferTokens (currency, amount, recipient) {
    switch (currency) {
      case 'eth':
        return this.props.transferETH(amount, recipient)
      case 'lht':
        return this.props.transferLHT(amount, recipient)
      case 'time':
        return this.props.transferTIME(amount, recipient)
      default:
        throw new Error('unknown currency')
    }
  }

  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value='wallet.sendTokens' /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />
        <SendForm onSubmit={this.handleSubmit} />
      </Paper>
    )
  }
}

export default SendWidget
