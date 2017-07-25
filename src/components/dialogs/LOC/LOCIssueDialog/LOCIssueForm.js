import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import validate from './validate'
import { Translate, I18n } from 'react-redux-i18n'
import { RaisedButton } from 'material-ui'
import './LOCIssueForm.scss'

const onSubmit = (values) => {
  return +values.get('amount')
}

@reduxForm({form: 'IssueForm', validate, onSubmit})
class LOCIssueForm extends Component {
  static propTypes = {
    loc: PropTypes.object,
    pristine: PropTypes.bool,
    handleSubmit: PropTypes.func
  }

  render () {
    const {loc, pristine, handleSubmit} = this.props
    const actionToken = I18n.t('locs.forms.actions.issued')

    return (
      <form name='IssueFormName' onSubmit={handleSubmit} styleName='root'>
        <p styleName='subHeader'><Translate value='forms.mustBeCoSigned' /></p>

        <Field
          component={TextField}
          name='amount'
          type='number'
          floatingLabelText={<Translate value='locs.forms.amountToBeS' action={actionToken} />}
        />

        <div styleName='footer'>
          <RaisedButton
            label={<Translate value='locs.issueS' asset={loc.currency()} />}
            primary
            onTouchTap={handleSubmit}
            disabled={pristine}
          />
        </div>

      </form>
    )
  }
}

export default LOCIssueForm
