/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'

import {
  FORM_NETWORK_CREATE,
} from '@chronobank/login/redux/network/actions'
import validate from './validate'

import styles from 'layouts/Splash/styles'
import './NetworkCreateModalForm.scss'

const textFieldStyles = {
  floatingLabelStyle: {
    color: '#A3A3CC',
    top: 28,
    left: 0,
    right: 0,
    margin: 'auto',
    textAlign: 'left',
    transformOrigin: 'left',
  },
  style: {
    height: 62,
    marginBottom: 20,
  },
  inputStyle: {
    color: '#A3A3CC',
    textAlign: 'left',
    marginTop: 0,
    paddingTop: 18,
  },
}

class NetworkCreateModalForm extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func,
    handleDeleteNetwork: PropTypes.func,
  }

  render () {
    const { handleSubmit, pristine, valid, isImportMode, error, network,
      handleDeleteNetwork, onCloseModal } = this.props

    return (
        <form styleName='form' name={FORM_NETWORK_CREATE} onSubmit={handleSubmit}>

          <Field
            component={TextField}
            name='url'
            type='text'
            label={
              <Translate value='NetworkCreateModalForm.address' />
            }
            fullWidth
            {...styles.textField}
            {...textFieldStyles}
          />

          <Field
            component={TextField}
            name='alias'
            type='text'
            label={
              <Translate value='NetworkCreateModalForm.alias' />
            }
            fullWidth
            {...styles.textField}
            {...textFieldStyles}
          />

          <div styleName='actions'>
            { network ? (
              <Button
                styleName='button buttonDelete'
                buttonType='login'
                onClick={handleDeleteNetwork}
                label={<div styleName='deleteIcon' className='chronobank-icon'>delete</div>}
              />
            ) : null }

            <Button
              styleName='button buttonCancel'
              buttonType='flat'
              onClick={onCloseModal}
              label={
                <Translate value='NetworkCreateModalForm.cancel' />
              }
            />
            <Button
              styleName='button buttonAdd'
              buttonType='login'
              type='submit'
              label={ network ? (
                <Translate value='NetworkCreateModalForm.save' />
              ) : (
                <Translate value='NetworkCreateModalForm.add' />
              ) }
            />

            { error ? (<div styleName='form-error'>{error}</div>) : null }
          </div>

        </form>
    )
  }
}

export default reduxForm({ form: FORM_NETWORK_CREATE, validate })(NetworkCreateModalForm)
