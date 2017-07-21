import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form/immutable'
import globalStyles from '../../../styles'
import { TextField } from 'redux-form-material-ui'
import validate from './validate'
import { Translate, I18n } from 'react-redux-i18n'

export const ISSUE_FORM_NAME = 'IssueForm'

const onSubmit = (values) => {
  return +values.get('amount')
}

@reduxForm({form: ISSUE_FORM_NAME, validate, onSubmit})
class LOCIssueForm extends Component {
  render () {
    const {loc} = this.props
    const actionToken = I18n.t('locs.forms.actions.issued')

    return (
      <form name='IssueFormName'>
        <div style={globalStyles.greyText}>
          <p><Translate value='forms.mustBeCoSigned' /></p>
          <p><Translate
            value='locs.forms.allowedToBeS'
            action={actionToken}
            name={loc.name()}
            limit={loc.issueLimit() - loc.issued()}
            currency={loc.currency()}
          /></p>
        </div>

        <Field
          component={TextField}
          name='amount'
          type='number'
          floatingLabelText={<Translate value='locs.forms.amountToBeS' action={actionToken} />}
        />

      </form>
    )
  }
}

LOCIssueForm.propTypes = {
  loc: PropTypes.object
}

export default LOCIssueForm
