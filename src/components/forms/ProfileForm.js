import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { validate } from '../../models/ProfileModel'

const mapStateToProps = (state) => ({
  initialValues: state.get('session').profile
})

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({form: 'ProfileForm', validate})
class ProfileForm extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func
  }

  render () {
    return (
      <form onSubmit={(values) => this.props.handleSubmit(values)}>
        <Field component={TextField} style={{width: '100%'}} name='name' floatingLabelText='Name' />
        <Field component={TextField} style={{width: '100%'}} name='email' floatingLabelText='Email' />
        <Field component={TextField} style={{width: '100%'}} name='company' floatingLabelText='Company' />
      </form>
    )
  }
}

export default ProfileForm
