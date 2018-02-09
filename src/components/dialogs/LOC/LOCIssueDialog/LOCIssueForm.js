import { Field, reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate, I18n } from 'react-redux-i18n'
import LOCModel from 'models/LOCModel'
import validate from './validate'

import './LOCIssueForm.scss'

const onSubmit = (values) => +values.get('amount')

@reduxForm({ form: 'IssueForm', validate, onSubmit })
class LOCIssueForm extends PureComponent {
  static propTypes = {
    loc: PropTypes.instanceOf(LOCModel),
    pristine: PropTypes.bool,
    handleSubmit: PropTypes.func,
  }

  render () {
    const { loc, pristine, handleSubmit } = this.props
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
