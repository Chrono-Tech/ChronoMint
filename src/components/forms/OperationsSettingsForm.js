import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { positiveInt } from '../../components/forms/validator'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => {
  const adminCount = state.get('operations').adminCount
  return {
    adminCount,
    initialValues: {
      requiredSigns: state.get('operations').required,
      adminCount
    }
  }
}

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({
  form: 'OperationsSettingsForm',
  validate: values => {
    const errors = {}
    errors.requiredSigns = positiveInt(values.get('requiredSigns'))
    if (!errors.requiredSigns && parseInt(values.get('requiredSigns'), 10) > parseInt(values.get('adminCount'), 10)) {
      errors.requiredSigns = 'Should not be greater than number of CBE'
    }
    return errors
  }
})
class OperationsSettingsForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <p><Translate value='operations.adminCount' />: <b>{this.props.adminCount}</b></p>
        <Field component={TextField}
          name='requiredSigns'
          style={{width: '100%'}}
          floatingLabelText={<Translate value='operations.requiredSigns' />}
        />
        <Field component={TextField} style={{display: 'none'}} disabled name='adminCount' />
      </form>
    )
  }
}

export default OperationsSettingsForm
