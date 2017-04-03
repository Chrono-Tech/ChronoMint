import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {connect} from 'react-redux'
import validate from './validate'
import globalStyles from '../../../styles'
import renderTextField from '../../common/renderTextField'
import {updateContractsManagerLHTBalance} from '../../../redux/wallet/wallet'

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
  updateBalance: () => dispatch(updateContractsManagerLHTBalance()),
})

@connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
@reduxForm({
  form: 'SendToExchangeForm',
  validate
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
          <p>Allowed to send: {contractsManagerBalance} LHUS</p>
        </div>

        <Field component={renderTextField}
          style={globalStyles.form.textField}
          name='sendAmount'
          floatingLabelText='Amount to send'
        />

      </form>
    )
  }
}

export default SendToExchangeForm
