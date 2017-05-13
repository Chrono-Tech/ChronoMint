import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  Divider
} from 'material-ui'
import SendForm from '../../forms/wallet/SendForm'
import globalStyles from '../../../styles'
import {
  transferETH,
  transferLHT,
  transferTIME
} from '../../../redux/wallet/actions'
import { Translate } from 'react-redux-i18n'

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = (dispatch) => ({
  transferETH: (amount, recipient) => dispatch(transferETH(amount, recipient)),
  transferLHT: (amount, recipient) => dispatch(transferLHT(amount, recipient)),
  transferTIME: (amount, recipient) => dispatch(transferTIME(amount, recipient))
})

@connect(null, mapDispatchToProps)
class SendWidget extends Component {
  handleSubmit = (values) => {
    const currency = values.get('currency')
    switch (currency) {
      case 'eth':
        return this.props.transferETH(values.get('amount'), values.get('recipient'))
      case 'lht':
        return this.props.transferLHT(values.get('amount'), values.get('recipient'))
      case 'time':
        return this.props.transferTIME(values.get('amount'), values.get('recipient'))
      default:
        return null
    }
  }

  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value="wallet.sendTokens" /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />
        <SendForm onSubmit={this.handleSubmit} />
      </Paper>
    )
  }
}

export default SendWidget
