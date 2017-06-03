import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { DatePicker, TextField, SelectField } from 'redux-form-material-ui'
import MenuItem from 'material-ui/MenuItem'
import FileSelect from '../../common/FileSelect/FileSelect'
import { Translate } from 'react-redux-i18n'
import validate from './validate'
import LOCModel from '../../../models/LOCModel'
import './LOCForm.scss'

export const LOC_FORM_NAME = 'LOCForm'

const mapStateToProps = (state) => ({
  locs: state.get('locs').locs
})

const onSubmit = (values, dispatch, props) => {
  return new LOCModel({
    ...props.initialValues,
    ...values.toJS(),
    oldName: props.initialValues.get('name'),
    issueLimit: +values.get('issueLimit'),
    expDate: values.get('expDate').getTime()
  })
}

@connect(mapStateToProps, null)
@reduxForm({form: LOC_FORM_NAME, validate, onSubmit})
class LOCForm extends Component {
  render () {
    const {handleSubmit, initialValues} = this.props

    return (
      <form onSubmit={handleSubmit} styleName='form'>
        <Field
          component={TextField}
          name='name'
          fullWidth
          floatingLabelText={<Translate value='locs.title' />}
        />
        <Field
          component={TextField}
          name='website'
          hintText='http://...'
          fullWidth
          floatingLabelText={<Translate value='terms.website' />}
        />
        <Field
          component={FileSelect}
          name='publishedHash'
          initPublishedHash={initialValues.get('publishedHash')}
          fullWidth
        />
        <Field
          component={DatePicker}
          name='expDate'
          fullWidth
          hintText={<Translate value='locs.expirationDate' />}
          floatingLabelText={<Translate value='locs.expirationDate' />}
        />

        <h3 styleName='header'><Translate value='locs.issuanceParameters' /></h3>
        <Field
          component={TextField}
          name='issueLimit'
          type='number'
          fullWidth
          floatingLabelText={<Translate value='locs.allowedToBeIssued' />}
        />
        {!initialValues.get('isNew') && <Field
          component={SelectField}
          name='status'
          fullWidth
          floatingLabelText={<Translate value='terms.status' />}
        >
          <MenuItem value={0} primaryText={<Translate value='locs.status.maintenance' />} />
          <MenuItem value={1} primaryText={<Translate value='locs.status.active' />} />
          <MenuItem value={2} primaryText={<Translate value='locs.status.suspended' />} />
          <MenuItem value={3} primaryText={<Translate value='locs.status.bankrupt' />} />
        </Field>}
      </form>
    )
  }
}

export default LOCForm
