import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { validate } from '../../../models/contracts/AbstractOtherContractModel'

@connect(null, null, null, {withRef: true})
@reduxForm({form: 'SettingsOtherContractForm', validate})
class OtherContractForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field component={TextField}
               name='address'
               style={{width: '100%'}}
               floatingLabelText='Contract address'
        />
      </form>
    )
  }
}

export default OtherContractForm
