import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {connect} from 'react-redux'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import moment from 'moment'
import momentLocaliser from 'react-widgets/lib/localizers/moment'
import validate from './validate'
import PollModel from '../../../models/PollModel'
import renderTextField from '../../common/renderTextField'
import optionsArray from './optionsArray'
import filesArray from './filesArray'

import 'react-widgets/dist/css/react-widgets.css'
import './styles.scss'

momentLocaliser(moment)

const mapStateToProps = state => {
  let initialValues = new PollModel().toJS()
  return ({initialValues})
}

const options = {withRef: true}

const renderDateTimePicker = ({ input: { onChange, value }, showTime }) =>
  <DateTimePicker
    onChange={onChange}
    time={showTime}
    value={!value ? null : new Date(value)}
  />

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
          Deadline:
          <Field component={renderDateTimePicker}
            name='deadline'
          />
          <Field component={renderTextField}
            name='pollTitle'
            floatingLabelText='Poll Title'
            maxLength={32}
            fullWidth
          />
          <Field component={renderTextField}
            name='voteLimit'
            type='number'
            floatingLabelText='Vote Limit'
            fullWidth
          />
          {optionsArray}
        </div>

        <div style={{float: 'right', width: '50%'}}>
          <div style={{marginTop: 24}}>{filesArray}</div>
        </div>
      </form>
    )
  }
}

export default NewPollForm
