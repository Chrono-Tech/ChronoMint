import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import globalStyles from '../../../styles'
import { SelectField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { MenuItem } from 'material-ui'

export const LOC_STATUS_FORM_NAME = 'LOCStatusForm'

const onSubmit = (values) => {
  return +values.get('status')
}

@reduxForm({form: LOC_STATUS_FORM_NAME, onSubmit})
class LOCStatusForm extends Component {
  render () {
    return (
      <form name='LOCStatusFormName'>
        <div style={globalStyles.greyText}>
          <p><Translate value='forms.mustBeCoSigned' /></p>
        </div>

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

      </form>
    )
  }
}

export default LOCStatusForm
