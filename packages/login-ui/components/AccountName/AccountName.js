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
import styles from 'layouts/Splash/styles'
import spinner from 'assets/img/spinningwheel-1.gif'
import {
  FORM_ACCOUNT_NAME,
} from '../../redux/constants'
import validate from './validate'
import './AccountName.scss'

class AccountName extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
  }

  render () {
    const { handleSubmit, error, isLoading, previousPage } = this.props

    return (
      <form styleName='form' name={FORM_ACCOUNT_NAME} onSubmit={handleSubmit}>

        <div styleName='page-title'>
          <Translate value='AccountName.title' />
        </div>

        <p styleName='description'>
          <Translate value='AccountName.description' />
          <br />
          <Translate value='AccountName.descriptionExtra' />
        </p>

        <div styleName='content'>

          <div styleName='field'>
            <Field
              component={TextField}
              name='accountName'
              label={<Translate value='AccountName.accountNamePlaceholder' />}
              fullWidth
              {...styles.textField}
            />
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
              label={isLoading
                ? <span styleName='spinner-wrapper'>
                  <img
                    src={spinner}
                    alt=''
                    width={24}
                    height={24}
                  />
                </span> : <Translate value='AccountName.submit' />}
              disabled={isLoading}
            />

            { error ? (<div styleName='form-error'>{error}</div>) : null }

            <Translate value='AccountName.or' />
            <br />
            <button onClick={previousPage} styleName='link'>
              <Translate value='AccountName.back' />
            </button>
          </div>
        </div>

      </form>
    )
  }
}

export default reduxForm({ form: FORM_ACCOUNT_NAME, validate })(AccountName)
