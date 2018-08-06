/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import {
  FORM_MNEMONIC_LOGIN_PAGE,
} from '../../redux/constants'
import validate from './validate'
import './LoginWithMnemonic.scss'

class LoginWithMnemonic extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
  }

  render () {
    const { handleSubmit, error, previousPage } = this.props

    return (
      <form styleName='form' name={FORM_MNEMONIC_LOGIN_PAGE} onSubmit={handleSubmit}>

        <div styleName='page-title'>
          <Translate value='LoginWithMnemonic.title' />
        </div>

        <div styleName='field'>
          <Field
            styleName='mnemonicField'
            component={TextField}
            name='mnemonic'
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
            <Translate value='LoginWithMnemonic.submit' />
          </Button>

          { error ? (<div styleName='form-error'>{error}</div>) : null }

          <Translate value='LoginWithMnemonic.or' />
          <br />
          <button onClick={previousPage} styleName='link'>
            <Translate value='LoginWithMnemonic.back' />
          </button>
        </div>

      </form>
    )
  }
}

export default reduxForm({ form: FORM_MNEMONIC_LOGIN_PAGE, validate })(LoginWithMnemonic)
