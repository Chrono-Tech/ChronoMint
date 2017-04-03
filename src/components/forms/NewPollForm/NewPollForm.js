import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {connect} from 'react-redux'
import validate from './validate'
import globalStyles from '../../../styles'
import PollModel from '../../../models/PollModel'
import renderTextField from '../../common/renderTextField'
import optionsArray from './optionsArray'
import filesArray from './filesArray'

const mapStateToProps = state => {
  let initialValues = new PollModel().toJS()
  return ({initialValues})
}

const options = {withRef: true}

@connect(mapStateToProps, null, null, options)
@reduxForm({
  form: 'NewPollForm',
  validate
})
class NewPollForm extends Component {
  render () {
    const {
      handleSubmit
    } = this.props
    return (
      <form onSubmit={handleSubmit} name='NewPollForm___Name'>

        <div style={{float: 'left', width: '50%'}}>
          <Field component={renderTextField}
            style={globalStyles.form.firstField}
            name='pollTitle'
            floatingLabelText='Poll Title'
            maxLength={32}
          />
          {optionsArray}
        </div>

        <div style={{float: 'right', width: '50%'}}>
          <Field component={renderTextField}
            style={{...globalStyles.form.firstField, width: '90%'}}
            name='pollDescription'
            multiLine
            rows={3}
            rowsMax={5}
            maxLength={30}
            floatingLabelText='Poll Description'
          />
          {filesArray}
        </div>
      </form>
    )
  }
}

export default NewPollForm
