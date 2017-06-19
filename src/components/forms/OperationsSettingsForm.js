import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'

import ErrorList from '../../components/forms/ErrorList'
import validator from '../../components/forms/validator'

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
  validate: values => { // TODO async validate
    const errors = {}
    errors.requiredSigns = ErrorList.toTranslate(validator.positiveInt(values.get('requiredSigns')))
    if (!errors.requiredSigns && parseInt(values.get('requiredSigns'), 10) > parseInt(values.get('adminCount'), 10)) {
      errors.requiredSigns = ErrorList.toTranslate('operations.errors.requiredSigns')
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
