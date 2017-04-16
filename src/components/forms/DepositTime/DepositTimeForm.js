import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {connect} from 'react-redux'
import validate from './validate'
import globalStyles from '../../../styles'
import renderTextField from '../../common/renderTextField'

const mapStateToProps = state => {
  const time = state.get('wallet').time
  return ({time})
}

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({form: 'DepositTimeForm', fields: ['amount'], validate})
class DepositTimeForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit} name='DepositTimeFormName'>
        <Field component={renderTextField}
          style={globalStyles.form.firstField}
          name='amount'
          type='number'
          floatingLabelText='Amount:'
        />
        {!this.props.submitting && this.props.error && <div style={{color: '#700'}}>{this.props.error}</div>}
      </form>
    )
  }
}

export default DepositTimeForm
