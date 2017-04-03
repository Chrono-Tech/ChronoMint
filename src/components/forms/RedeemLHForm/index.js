import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {connect} from 'react-redux'
import validate from './validate'
import globalStyles from '../../../styles'
import renderTextField from '../../common/renderTextField'

const mapStateToProps = state => {
  const loc = state.get('loc')

  return ({
    loc,
    initialValues: {
      address: loc.address,
      redeemAmount: 0
    }
  })
}

const mapDispatchToProps = null
const mergeProps = null
const options = {withRef: true}

@connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
@reduxForm({
  form: 'RedeemLHForm',
  validate
})
class RedeemLHForm extends Component {
  render () {
    const {
      handleSubmit,
      loc
    } = this.props
    return (
      <form onSubmit={handleSubmit} name='RedeemLHFormName'>

        <div style={globalStyles.modalGreyText}>
          <p>Allowed to be redeemed on behalf of {loc.locName}: {loc.issued() - loc.redeemed()} LHUS</p>
          <p>This operation must be co-signed by other CBE key holders before it is executed. Corresponding
            fees will be deducted from this amount</p>
        </div>

        <Field component={renderTextField}
          style={globalStyles.form.textField}
          name='redeemAmount'
          floatingLabelText='Almount to be redeemed'
        />

        <Field component={renderTextField} name='address' style={{display: 'none'}} />

      </form>
    )
  }
}

export default RedeemLHForm
