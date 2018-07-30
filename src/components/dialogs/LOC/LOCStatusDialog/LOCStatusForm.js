/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Field, reduxForm } from 'redux-form/immutable'
import { MenuItem } from '@material-ui/core'
import { Button } from 'components'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Select from 'redux-form-material-ui/es/Select'
import { Translate } from 'react-redux-i18n'

import './LOCStatusForm.scss'

const onSubmit = (values) => +values.get('status')

@reduxForm({ form: 'LOCStatusForm', onSubmit })
class LOCStatusForm extends PureComponent {
  static propTypes = {
    pristine: PropTypes.bool,
    handleSubmit: PropTypes.func,
  }

  render () {
    const { pristine, handleSubmit } = this.props
    return (
      <form name='LOCStatusFormName' onSubmit={handleSubmit} styleName='root'>
        <p styleName='subHeader'><Translate value='forms.mustBeCoSigned' /></p>

        <Field
          component={Select}
          name='status'
          fullWidth
          floatingLabelText={<Translate value='terms.status' />}
        >
          <MenuItem value={0} primaryText={<Translate value='locs.status.maintenance' />} />
          <MenuItem value={1} primaryText={<Translate value='locs.status.active' />} />
          <MenuItem value={2} primaryText={<Translate value='locs.status.suspended' />} />
          <MenuItem value={3} primaryText={<Translate value='locs.status.bankrupt' />} />
        </Field>

        <div styleName='footer'>
          <Button
            label={<Translate value='locs.updateStatus' />}
            onClick={handleSubmit}
            disabled={pristine}
          />
        </div>

      </form>
    )
  }
}

export default LOCStatusForm
