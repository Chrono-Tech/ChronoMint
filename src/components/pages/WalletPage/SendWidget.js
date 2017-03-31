import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Paper,
  Divider
} from 'material-ui'

import SendForm from './SendForm'

import globalStyles from '../../../styles'

import {
  transferEth,
  transferLht,
  transferTime
} from '../../../redux/wallet/wallet'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
})

const mapDispatchToProps = (dispatch) => ({
  transferEth: (amount, recipient) => dispatch(transferEth(amount, recipient)),
  transferLht: (amount, recipient) => dispatch(transferLht(amount, recipient)),
  transferTime: (amount, recipient, account) => dispatch(transferTime(amount, recipient, account))
})

@connect(mapStateToProps, mapDispatchToProps)
class SendWidget extends Component {
  handleSubmit = (values) => {
    switch (values.get('currency')) {
      case 'ETH':
        this.props.transferEth(values.get('amount'), values.get('recipient'))
        break
      case 'LHT':
        this.props.transferLht(values.get('amount'), values.get('recipient'))
        break
      case 'TIME':
        this.props.transferTime(values.get('amount'), values.get('recipient'), this.props.account)
        break
      default:
    }
  };

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
