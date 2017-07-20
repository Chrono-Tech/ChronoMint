import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { validate } from '../../../../models/CBEModel'
import { formCBELoadName } from '../../../../redux/settings/user/cbe/actions'
import { Translate } from 'react-redux-i18n'
import validator from '../../../forms/validator'

export const FORM_SETTINGS_CBE = 'SettingsCBEAddressForm'

const mapStateToProps = (state) => ({
  initialValues: state.get('settingsUserCBE').selected
})

const mapDispatchToProps = (dispatch) => ({
  handleAddressChange: (e, newValue) => validator.address(newValue) === null ? dispatch(formCBELoadName(newValue)) : false
})

@connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
@reduxForm({form: FORM_SETTINGS_CBE, validate})
class CBEAddressForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field component={TextField}
          name='address'
          style={{width: '100%'}}
          floatingLabelText={<Translate value='common.ethAddress'/>}
          onChange={this.props.handleAddressChange}
          disabled={this.props.initialValues.address() !== null}
        />
        <Field component={TextField}
          name='name'
          style={{width: '100%'}}
          floatingLabelText={<Translate value='common.name'/>}
        />
      </form>
    )
  }
}

CBEAddressForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleAddressChange: PropTypes.func,
  initialValues: PropTypes.object
}

export default CBEAddressForm
