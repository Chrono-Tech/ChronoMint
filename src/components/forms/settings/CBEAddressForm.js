import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form/immutable'
import {TextField} from 'redux-form-material-ui'
import {validate} from '../../../models/CBEModel'
import {formCBELoadName} from '../../../redux/settings/cbe'
import isEthAddress from '../../../utils/isEthAddress'

const mapStateToProps = (state) => ({
  initialValues: state.get('settingsCBE').selected
})

const mapDispatchToProps = (dispatch) => ({
  handleAddressChange: (e, newValue) => isEthAddress(newValue) ? dispatch(formCBELoadName(newValue)) : false
})

@connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
@reduxForm({form: 'SettingsCBEAddressForm', validate})
class CBEAddressForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field component={TextField}
          name='address'
          style={{width: '100%'}}
          floatingLabelText='Ethereum account'
          onChange={this.props.handleAddressChange}
          disabled={this.props.initialValues.address() != null}
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
