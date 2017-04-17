import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {connect} from 'react-redux'
import {DatePicker, SelectField} from 'redux-form-material-ui'
import MenuItem from 'material-ui/MenuItem'
import FileSelect from '../../common/IPFSFileSelect'
import validate from './validate'
import globalStyles from '../../../styles'
import renderTextField from '../../common/renderTextField'

const mapStateToProps = state => {
  const loc = state.get('loc').toJS()
  return ({
    initialValues: {
      ...loc,
      expDate: new Date(loc.expDate)
    }
  })
}

const options = {withRef: true}

@connect(mapStateToProps, null, null, options)
@reduxForm({form: 'LOCForm', validate})
class LOCForm extends Component {
  render () {
    const {
      handleSubmit,
      initialValues
    } = this.props
    return (
      <form onSubmit={handleSubmit} name='LOCFormName'>

        <Field component={renderTextField}
          style={globalStyles.form.firstField}
          name='locName'
          floatingLabelText='LOC title'
        />
        <br />

        <Field component={renderTextField}
          style={globalStyles.form.textField}
          name='website'
          hintText='http://...'
          floatingLabelText='website'
        />

        <Field component={FileSelect}
          style={globalStyles.form.textField}
          name='publishedHash'
          initPublishedHash={initialValues.get('publishedHash')}
          fileInputProps={{accept: 'application/pdf, text/*, image/*, .doc, .docx'}}
        />

        <Field component={DatePicker}
          name='expDate'
          hintText='Expiration Date'
          floatingLabelText='Expiration Date'
        />

        <h3 style={{marginTop: 20}}>Issuance parameters</h3>
        <Field component={renderTextField}
          style={globalStyles.form.firstField}
          name='issueLimit'
          type='number'
          floatingLabelText='Allowed to be issued'
        />
        <br />
        <Field component={renderTextField}
          name='fee'
          floatingLabelText='Insurance fee'
          hintText={'0.0%'}
          floatingLabelFixed
          style={{marginTop: -8, pointerEvents: 'none'}}
        />
        <br />
        {initialValues.get('address') ? <Field component={SelectField}
          name='status'
          floatingLabelText='Status'
        >
          <MenuItem value={0} primaryText='Maintenance' />
          <MenuItem value={1} primaryText='Active' />
          <MenuItem value={2} primaryText='Suspended' />
          <MenuItem value={3} primaryText='Bankrupt' />
        </Field> : ''}
        <Field component={renderTextField} name='address' style={{display: 'none'}} />

        {!this.props.submitting && this.props.error && <div style={{color: '#700'}}>{this.props.error}</div>}
      </form>
    )
  }
}

export default LOCForm
