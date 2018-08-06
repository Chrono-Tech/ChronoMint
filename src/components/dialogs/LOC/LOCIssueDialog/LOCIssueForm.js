/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Field, reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { Button } from 'components'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate, I18n } from 'react-redux-i18n'
import LOCModel from '@chronobank/core/models/LOCModel'
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
          label={<Translate value='locs.forms.amountToBeS' action={actionToken} />}
        />

        <div styleName='footer'>
          <Button
            label={<Translate value='locs.issueS' asset={loc.currency()} />}
            onClick={handleSubmit}
            disabled={pristine}
          />
        </div>

      </form>
    )
  }
}

export default LOCIssueForm
