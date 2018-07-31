/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import {
  FORM_PRIVATE_KEY_LOGIN_PAGE,
} from '../../redux/actions'
import validate from './validate'
import './LoginWithPrivateKey.scss'

class LoginWithPrivateKey extends PureComponent {
  render () {
    const { handleSubmit, error } = this.props

    return (
      <form styleName='form' name={FORM_PRIVATE_KEY_LOGIN_PAGE} onSubmit={handleSubmit}>

        <div styleName='page-title'>
          <Translate value='LoginWithPrivateKey.title' />
        </div>

        <div styleName='field'>
          <Field
            styleName='pkField'
            component={TextField}
            name='pk'
            type='text'
            fullWidth
            multiline
            InputProps={{
              disableUnderline: true,
            }}
            rows={2}
            rowsMax={2}
          />
        </div>

        <div styleName='actions'>
          <Button
            styleName='button'
            buttonType='login'
            type='submit'
          >
            <Translate value='LoginWithPrivateKey.submit' />
          </Button>

          { error ? (<div styleName='form-error'>{error}</div>) : null }

          <Translate value='LoginWithPrivateKey.or' />
          <br />
          <Link to='/login/import-methods' href styleName='link'>
            <Translate value='LoginWithPrivateKey.back' />
          </Link>
        </div>

      </form>
    )
  }
}

export default reduxForm({ form: FORM_PRIVATE_KEY_LOGIN_PAGE, validate })(LoginWithPrivateKey)
