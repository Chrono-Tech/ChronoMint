/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Checkbox, TextField } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'
import { createPlatform } from 'redux/assetsManager/actions'
import './AddPlatformForm.scss'
import validate from './validate'

function prefix (token) {
  return `Assets.AddPlatformForm.${token}`
}

export const FORM_ADD_PLATFORM_DIALOG = 'AddPlatformDialog'

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
    onClose: PropTypes.func,
    formValues: PropTypes.object,
    formErrors: PropTypes.object,
    onSubmitFunc: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
  }

  render () {
    const alreadyHave = this.props.formValues && this.props.formValues.get('alreadyHave')

    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='dialogHeader'>
          <div styleName='dialogHeaderStuff'>
            <div styleName='dialogHeaderTitle'>
              <Translate value={prefix('dialogTitle')} />
            </div>
          </div>
        </div>
        <div styleName='dialogBody'>

          <Field
            styleName='checkboxField'
            component={Checkbox}
            name='alreadyHave'
            label={<Translate value={prefix('alreadyHave')} />}
          />

          {
            alreadyHave
              ? <Field
                component={TextField}
                name='platformAddress'
                fullWidth
                floatingLabelText={<Translate value={prefix('platformAddress')} />}
              />
              : null
          }

        </div>
        <div
          styleName='dialogFooter'
        >
          <RaisedButton
            disabled={!!this.props.formErrors}
            styleName='action'
            label={<Translate value={prefix('dialogTitle')} />}
            type='submit'
            primary
          />
        </div>
      </form>
    )
  }
}
