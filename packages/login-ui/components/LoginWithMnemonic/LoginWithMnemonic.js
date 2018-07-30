/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form/immutable'
import { Link } from 'react-router'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import {
  onSubmitMnemonicLoginForm,
  onSubmitMnemonicLoginFormSuccess,
  onSubmitMnemonicLoginFormFail,
} from '../../redux/thunks'
import {
  FORM_MNEMONIC_LOGIN_PAGE,
} from '../../redux/actions'
import validate from './validate'
import './LoginWithMnemonic.scss'

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: async (values) => {
      const confirmMnemonic = values.get('mnemonic')
      await dispatch(onSubmitMnemonicLoginForm(confirmMnemonic))
    },
    onSubmitSuccess: () => dispatch(onSubmitMnemonicLoginFormSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitMnemonicLoginFormFail(errors, submitErrors)),
  }
}

class LoginWithMnemonic extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
  }

  render () {
    const { handleSubmit, error } = this.props

    return (
      <MuiThemeProvider>
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
            <Link to='/login/import-methods' href styleName='link'>
              <Translate value='LoginWithMnemonic.back' />
            </Link>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_MNEMONIC_LOGIN_PAGE, validate })(LoginWithMnemonic)
export default connect(null, mapDispatchToProps)(form)
