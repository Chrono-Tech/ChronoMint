import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Divider } from 'material-ui'
import SendForm from '../../forms/wallet/SendForm'
import globalStyles from '../../../styles'
import { transfer } from '../../../redux/wallet/actions'
import { reset } from 'redux-form'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => ({
  tokens: state.get('wallet').tokens
})

const mapDispatchToProps = (dispatch) => ({
  transfer: (token, amount, recipient) => dispatch(transfer(token, amount, recipient)),
  resetForm: () => dispatch(reset('sendForm'))
})

@connect(mapStateToProps, mapDispatchToProps)
class SendWidget extends Component {
  handleSubmit = async (values) => {
    await this.props.transfer(
      this.props.tokens.get(values.get('currency')),
      values.get('amount'),
      values.get('recipient')
    )
    this.props.resetForm()
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
