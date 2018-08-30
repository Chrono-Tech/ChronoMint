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
  FORM_DERIVATION_PATH,
} from '../../redux/constants'
import './DerivationPathForm.scss'

class DerivationPathForm extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
  }

  render () {
    const { handleSubmit, error, previousPage, submitting } = this.props

    return (
      <form styleName='form' name={FORM_DERIVATION_PATH} onSubmit={handleSubmit}>

        <div styleName='page-title'>
          <Translate value='DerivationPathForm.title' />
        </div>

        <div styleName='field'>
          <Field
            component={TextField}
            name='path'
            type='text'
            label={<Translate value='DerivationPathForm.path' />}
            fullWidth
          />
        </div>

        <div styleName='actions'>
          <Button
            styleName='button'
            buttonType='login'
            type='submit'
            isLoading={submitting}
          >
            <Translate value='DerivationPathForm.submit' />
          </Button>

          { error ? (<div styleName='form-error'>{error}</div>) : null }

          <Translate value='DerivationPathForm.or' />
          <br />
          <button onClick={previousPage} styleName='link'>
            <Translate value='DerivationPathForm.back' />
          </button>
        </div>

      </form>
    )
  }
}

export default reduxForm({ form: FORM_DERIVATION_PATH })(DerivationPathForm)
