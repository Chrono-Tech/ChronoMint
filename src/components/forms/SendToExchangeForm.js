import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import validator from './validator'
import globalStyles from '../../styles'
import { updateCMLHTBalance } from '../../redux/wallet/actions'
import ErrorList from './ErrorList'
import { TextField } from 'redux-form-material-ui'

const mapStateToProps = state => {
  const contractsManagerBalance = state.get('wallet').contractsManagerLHT.balance

  return ({
    contractsManagerBalance,
    initialValues: {
      sendAmount: 0
    }
  })
}

const mapDispatchToProps = (dispatch) => ({
  updateBalance: () => dispatch(updateCMLHTBalance())
})

@connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
@reduxForm({
  form: 'SendToExchangeForm',
  validate: (values, props) => {
    const sendAmount = values.get('sendAmount')
    const errorsSendAmount = new ErrorList()
    errorsSendAmount.add(validator.required(sendAmount))
    errorsSendAmount.add(validator.positiveInt(sendAmount))
    if (Number(values.get('sendAmount')) > props.contractsManagerBalance) {
      errorsSendAmount.add('errors.greaterThanAllowed')
    }
    return {
      sendAmount: errorsSendAmount.getErrors()
    }
  }
})
class SendToExchangeForm extends Component {
  componentWillMount () {
    this.props.updateBalance()
  }

  render () {
    const {
      handleSubmit,
      contractsManagerBalance
    } = this.props
    return (
      <form onSubmit={handleSubmit} name='SendToExchangeFormName'>

        <div style={globalStyles.greyText}>
          <p>This operation must be co-signed by other CBE key holders before it is executed. Corresponding
            fees will be deducted from this amount</p>
          <p>Allowed to send: {contractsManagerBalance} LHT</p>
        </div>

        <Field component={TextField}
          name='sendAmount'
          type='number'
          floatingLabelText='Amount to send'
        />

        {!this.props.submitting && this.props.error && <div style={{color: '#700'}}>{this.props.error}</div>}
      </form>
    )
  }
}

export default SendToExchangeForm
