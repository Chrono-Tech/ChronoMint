import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { DatePicker, TextField } from 'redux-form-material-ui'
import FileSelect from '../../common/FileSelect/FileSelect'
import { Translate, I18n } from 'react-redux-i18n'
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
          value={initialValues.get('publishedHash')}
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
          floatingLabelText={<Translate value='locs.forms.amountToBeS' action={I18n.t('locs.forms.actions.issued')} />}
        />
      </form>
    )
  }
}

LOCForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object
}

export default LOCForm
