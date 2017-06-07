import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import globalStyles from '../../../styles'
import { TextField } from 'redux-form-material-ui'
import validate from './validate'
import { Translate } from 'react-redux-i18n'

export const ISSUE_FORM_NAME = 'IssueForm'

const onSubmit = (values) => {
  return +values.get('issueAmount')
}

@reduxForm({form: ISSUE_FORM_NAME, validate, onSubmit})
class IssueLHForm extends Component {
  render () {
    const {loc} = this.props
    const currency = loc.currencyString()

    return (
      <form name='IssueFormName'>
        <div style={globalStyles.greyText}>
          <p><Translate value='forms.mustBeCoSigned' /></p>
          <p><Translate
            value='locs.forms.allowedToBeIssued'
            name={loc.name()}
            limit={loc.issueLimit() - loc.issued()}
            currency={currency}
          /></p>
        </div>

        <Field
          component={TextField}
          name='issueAmount'
          type='number'
          floatingLabelText={<Translate value='locs.forms.amountToBeIssued' />}
        />

      </form>
    )
  }
}

export default IssueLHForm
