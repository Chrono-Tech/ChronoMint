import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { validateRules } from '../../../models/CBEModel'
import { formCBELoadName } from '../../../redux/settings/cbe'
import { declarativeValidator } from '../../../utils/validator'

export const FORM_SETTINGS_CBE = 'SettingsCBEAddressForm'

const mapStateToProps = (state) => ({
  initialValues: state.get('settingsCBE').selected
})

const mapDispatchToProps = (dispatch) => ({
  handleAddressChange: (e, newValue) => validator.address(newValue) === null ? dispatch(formCBELoadName(newValue)) : false
})

@connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
@reduxForm({form: FORM_SETTINGS_CBE, validate: declarativeValidator(validateRules)})
class CBEAddressForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field component={TextField}
          name='address'
          style={{width: '100%'}}
          floatingLabelText='Ethereum account'
          onChange={this.props.handleAddressChange}
          disabled={this.props.initialValues.address() !== null}
        />
        <Field component={TextField}
          name='name'
          style={{width: '100%'}}
          floatingLabelText='Member name'
        />
      </form>
    )
  }
}

export default CBEAddressForm
