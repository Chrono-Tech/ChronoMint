import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import globalStyles from '../../styles'
import renderTextField from '../common/renderTextField'
import { declarativeValidator } from '../../utils/validator'

const mapStateToProps = state => {
  const time = state.get('wallet').time
  return ({time})
}

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({
  form: 'DepositTIMEForm',
  fields: ['amount'],
  validate: declarativeValidator({
    amount: 'numeric|positive-number'
  })
})
class DepositTIMEForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit} name='DepositTIMEFormName'>
        <Field
          component={renderTextField}
          style={globalStyles.form.firstField}
          name='amount'
          type='number'
          floatingLabelText='Amount:'
          fullWidth
        />
        {!this.props.submitting && this.props.error && <div style={{color: '#700'}}>{this.props.error}</div>}
      </form>
    )
  }
}

export default DepositTIMEForm
