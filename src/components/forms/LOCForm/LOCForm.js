import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { DatePicker, TextField, SelectField } from 'redux-form-material-ui'
import MenuItem from 'material-ui/MenuItem'
import FileSelect from '../../common/FileSelect/FileSelect'
import { Translate } from 'react-redux-i18n'
import validate from './validate'
// TODO @dkchv: !!!!
import LOCModel2 from '../../../models/LOCModel2'
import './LOCForm.scss'

export const LOC_FORM_NAME = 'LOCForm'

const mapStateToProps = state => {
  const loc = state.get('loc')
  return {
    initialValues: {
      ...loc.toJS(),
      issueLimit: loc.issueLimit(),
      issued: loc.issued(),
      expDate: new Date(loc.expDate()),
      publishedHash: loc.publishedHash()
    }
  }
}

const onSubmit = (values) => {
  return new LOCModel2({
    ...values.toJS(),
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
          fileInputProps={{accept: 'application/pdf, text/*, image/*, .doc, .docx'}}
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
        <Field
          component={TextField}
          name='fee'
          floatingLabelText={<Translate value='locs.insuranceFee' />}
          hintText={'0.0%'}
          floatingLabelFixed
          fullWidth
          disabled
        />
        <Field
          component={SelectField}
          name='status'
          fullWidth
          floatingLabelText={<Translate value='terms.status' />}
        >
          <MenuItem value={0} primaryText={<Translate value='locs.status.maintenance' />} />
          <MenuItem value={1} primaryText={<Translate value='locs.status.active' />} />
          <MenuItem value={2} primaryText={<Translate value='locs.status.suspended' />} />
          <MenuItem value={3} primaryText={<Translate value='locs.status.bankrupt' />} />
        </Field>

        {!this.props.submitting && this.props.error && (
          <div styleName='error'>
            {this.props.error}
          </div>
        )}
      </form>
    )
  }
}

export default LOCForm
