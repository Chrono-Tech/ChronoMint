import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Divider } from 'material-ui'
import SendForm from '../../forms/wallet/SendForm'
import globalStyles from '../../../styles'
import { resetSendForm, transfer } from '../../../redux/wallet/actions'
import { Translate } from 'react-redux-i18n'

const mapDispatchToProps = (dispatch) => ({
  transfer: (currency, amount, recipient) => dispatch(transfer(currency, amount, recipient)),
  resetSendForm: () => dispatch(resetSendForm())
})

@connect(null, mapDispatchToProps)
class SendWidget extends Component {
  handleSubmit = async (values) => {
    await this.props.transfer(values.get('currency'), values.get('amount'), values.get('recipient'))
    this.props.resetSendForm()
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
