import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { declarativeValidator } from '../../../utils/validator'
import { validateRules } from '../../../models/contracts/TokenContractModel'

@connect(null, null, null, {withRef: true})
@reduxForm({form: 'SettingsTokenForm', validate: declarativeValidator(validateRules)})
class TokenForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field component={TextField}
          name='address'
          style={{width: '100%'}}
          floatingLabelText='Token asset or proxy contract address'
        />
      </form>
    )
  }
}

export default TokenForm
