import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import validator from '../validator'
import globalStyles from '../../../styles'
import { updateCMLHTBalance } from '../../../redux/wallet/actions'
import ErrorList from '../ErrorList'
import { TextField } from 'redux-form-material-ui'

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
    const redeemAmount = values.get('redeemAmount')
    const errorsRedeemAmount = new ErrorList()
    errorsRedeemAmount.add(validator.required(redeemAmount))
    errorsRedeemAmount.add(validator.positiveInt(redeemAmount))
    if (Number(redeemAmount) > props.allowRedeem) {
      errorsRedeemAmount.add('errors.greaterThanAllowed')
    }

    return {
      redeemAmount: errorsRedeemAmount.getErrors()
    }
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

        <div style={globalStyles.greyText}>
          <p>This operation must be co-signed by other CBE key holders before it is executed. Corresponding
            fees will be deducted from this amount</p>
          <p>Allowed to be redeemed on behalf of {locName}: {allowRedeem} LHT</p>
        </div>

        <Field
          component={TextField}
          name='redeemAmount'
          type='number'
          floatingLabelText='Amount to be redeemed'
        />

        <Field
          component={TextField}
          name='address'
          style={{display: 'none'}}
        />

        {!this.props.submitting && this.props.error && <div style={{color: '#700'}}>{this.props.error}</div>}
      </form>
    )
  }
}

export default RedeemLHForm
