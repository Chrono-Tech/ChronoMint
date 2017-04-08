import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {connect} from 'react-redux'
import validate from './validate'
import renderTextField from '../../common/renderTextField'

const mapStateToProps = state => ({
  initialValues: {
    numberOfSignatures: state.get('operationsProps').signaturesRequired()
  }
})

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({
  form: 'ChangeNumberSignaturesForm',
  validate: validate
})
class ChangeNumberSignaturesForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit} name='ChangeNumberSignaturesFormName'>
        <Field component={renderTextField}
          name='numberOfSignatures'
          type='number'
          floatingLabelText='Number Of Required Signatures'
        />
      </form>
    )
  }
}

export default ChangeNumberSignaturesForm
