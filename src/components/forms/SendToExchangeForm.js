import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import * as validation from './validate'
import globalStyles from '../../styles'
import renderTextField from '../common/renderTextField'
import { updateCMLHTBalance } from '../../redux/wallet/actions'

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
    const errors = {}

    errors.sendAmount = validation.positiveInt(values.get('sendAmount'))
    if (Number(values.get('sendAmount')) > props.contractsManagerBalance) {
      errors.sendAmount = 'Amount is greater than allowed'
    }

    return errors
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

        <div style={globalStyles.modalGreyText}>
          <p>This operation must be co-signed by other CBE key holders before it is executed. Corresponding
            fees will be deducted from this amount</p>
          <p>Allowed to send: {contractsManagerBalance} LHT</p>
        </div>

        <Field component={renderTextField}
          style={globalStyles.form.textField}
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
