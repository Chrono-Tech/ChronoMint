import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { validate } from '../../models/UserModel'

const mapStateToProps = (state) => ({
  initialValues: state.get('session').profile // TODO MINT-109 Profile form is always empty when application initializes from it route
})

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({form: 'ProfileForm', validate})
class ProfileForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field component={TextField} style={{width: '100%'}} name='name' floatingLabelText='Name' />
        <Field component={TextField} style={{width: '100%'}} name='email' floatingLabelText='Email' />
        <Field component={TextField} style={{width: '100%'}} name='company' floatingLabelText='Company' />
      </form>
    )
  }
}

export default ProfileForm
