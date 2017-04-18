import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import validation from './validate'
import globalStyles from '../../styles'
import renderTextField from '../common/renderTextField'
import { updateCMLHTBalance } from '../../redux/wallet/actions'

const mapStateToProps = state => {
  const loc = state.get('loc')
  const contractsManagerBalance = state.get('wallet').contractsManagerLHT.balance
  return ({
    locName: loc.name(),
    allowRedeem: Math.min(contractsManagerBalance, loc.issued() - loc.redeemed()),
    initialValues: {
      address: loc.getAddress(),
      redeemAmount: 0
    }
  })
}

const mapDispatchToProps = (dispatch) => ({
  updateBalance: () => dispatch(updateCMLHTBalance())
})

const options = {withRef: true}

@connect(mapStateToProps, mapDispatchToProps, null, options)
@reduxForm({
  form: 'RedeemLHForm',
  validate: (values, props) => {
    const errors = {}

    errors.redeemAmount = validation.positiveInt(values.get('redeemAmount'))
    if (Number(values.get('redeemAmount')) > props.allowRedeem) {
      errors.redeemAmount = 'Amount is greater than allowed'
    }

    return errors
  }
})
class RedeemLHForm extends Component {
  componentWillMount () {
    this.props.updateBalance()
  }

  render () {
    const {
      handleSubmit,
      locName,
      allowRedeem
    } = this.props
    return (
      <form onSubmit={handleSubmit} name='RedeemLHFormName'>

        <div style={globalStyles.modalGreyText}>
          <p>This operation must be co-signed by other CBE key holders before it is executed. Corresponding
            fees will be deducted from this amount</p>
          <p>Allowed to be redeemed on behalf of {locName}: {allowRedeem} LHT</p>
        </div>

        <Field component={renderTextField}
               style={globalStyles.form.textField}
               name='redeemAmount'
               type='number'
               floatingLabelText='Amount to be redeemed'
        />

        <Field component={renderTextField} name='address' style={{display: 'none'}}/>

        {!this.props.submitting && this.props.error && <div style={{color: '#700'}}>{this.props.error}</div>}
      </form>
    )
  }
}

export default RedeemLHForm
