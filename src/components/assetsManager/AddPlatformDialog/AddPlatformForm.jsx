/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { FormControlLabel } from '@material-ui/core'
import { Checkbox, TextField } from 'redux-form-material-ui'
import { Field, reduxForm, formPropTypes } from 'redux-form/immutable'
import { createPlatform } from '@chronobank/core/redux/assetsManager/actions'
import { FORM_ADD_PLATFORM_DIALOG } from 'components/constants'
import './AddPlatformForm.scss'
import validate from './validate'

export const prefix = (token) => {
  return `Assets.AddPlatformForm.${token}`
}

function mapStateToProps (state) {
  const form = state.get('form')
  return {
    formValues: form.get(FORM_ADD_PLATFORM_DIALOG) && form.get(FORM_ADD_PLATFORM_DIALOG).get('values'),
    formErrors: form.get(FORM_ADD_PLATFORM_DIALOG) && form.get(FORM_ADD_PLATFORM_DIALOG).get('syncErrors'),
  }
}

const onSubmit = (values, dispatch) => {
  dispatch(createPlatform(values))
}

@connect(mapStateToProps)
@reduxForm({ form: FORM_ADD_PLATFORM_DIALOG, validate, onSubmit })
export default class AddPlatformForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    ...formPropTypes,
  }

  render () {
    const alreadyHave = this.props.formValues && this.props.formValues.get('alreadyHave')

    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='dialogBody'>
          <FormControlLabel
            control={
              <Field
                styleName='checkboxField'
                component={Checkbox}
                name='alreadyHave'
              />
            }
            label={I18n.t(prefix('alreadyHave'))}
          />
          {
            alreadyHave
              ? <Field
                component={TextField}
                name='platformAddress'
                fullWidth
                placeholder={I18n.t(prefix('platformAddress'))}
              />
              : null
          }

        </div>
        <div
          styleName='dialogFooter'
        >
          <Button
            disabled={!!this.props.formErrors}
            styleName='action'
            label={I18n.t(prefix('platformAddress'))}
            type='submit'
            primary
          />
        </div>
      </form>
    )
  }
}
