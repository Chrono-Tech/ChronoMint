import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  Divider
} from 'material-ui'
import SendForm from './SendForm'
import globalStyles from '../../../styles'
import {
  transferETH,
  transferLHT,
  transferTIME
} from '../../../redux/wallet/actions'

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = (dispatch) => ({
  transferETH: (amount, recipient) => dispatch(transferETH(window.localStorage.account, amount, recipient)),
  transferLHT: (amount, recipient) => dispatch(transferLHT(window.localStorage.account, amount, recipient)),
  transferTIME: (amount, recipient) => dispatch(transferTIME(window.localStorage.account, amount, recipient))
})

@connect(null, mapDispatchToProps)
class SendWidget extends Component {
  handleSubmit = (values) => {
    this.props['transfer' + values.get('currency')](values.get('amount'), values.get('recipient'))
  }

  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}>Send tokens</h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />
        <SendForm onSubmit={this.handleSubmit} />
      </Paper>
    )
  }
}

export default SendWidget
