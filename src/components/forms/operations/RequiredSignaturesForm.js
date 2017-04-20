import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import renderTextField from '../../common/renderTextField'

const mapStateToProps = state => ({
  initialValues: {
    numberOfSignatures: state.get('operationsProps').signaturesRequired()
  }
})

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({
  form: 'RequiredSignaturesForm',
  validate: (values) => {
    const errors = {}

    const val = values.get('numberOfSignatures')
    if (!val || isNaN(val) || val > 5 || val < 1) {
      errors.numberOfSignatures = 'Should be between 1 and 5'
    }

    return errors
  }
})
class RequiredSignaturesForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit} name='RequiredSignaturesFormName'>
        <Field component={renderTextField}
          name='numberOfSignatures'
          type='number'
          floatingLabelText='Number Of Required Signatures'
        />
      </form>
    )
  }
}

export default RequiredSignaturesForm
