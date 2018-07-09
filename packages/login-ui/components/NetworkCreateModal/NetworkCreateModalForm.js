/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'

import {
  FORM_NETWORK_CREATE,
} from '../../../login/redux/network/actions'
import validate from './validate'

import styles from 'layouts/Splash/styles'
import './NetworkCreateModal.scss'

const textFieldStyles = {
  floatingLabelStyle: {
    color: '#A3A3CC',
    top: 28,
    left: 0,
    right: 0,
    margin: 'auto',
    textAlign: 'left',
    transformOrigin: 'center center',
  },
  style: {
    height: 62,
    marginBottom: 20,
  },
}

const mapStateToProps = (state, ownProps) => {
  const network = ownProps.network

  return {
    initialValues: {
      url: network && network.url,
      alias: network && network.alias,
    },
  }
}

class NetworkCreateModalForm extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func,
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues, isImportMode, error, onSubmit} = this.props

    return (
      <MuiThemeProvider muiTheme={styles.inverted}>
        <form styleName='form' name={FORM_NETWORK_CREATE} onSubmit={handleSubmit}>

          <Field
            component={TextField}
            name='url'
            type='text'
            floatingLabelText='IP address or domain name'
            fullWidth
            {...styles.textField}
            {...textFieldStyles}
          />

          <Field
            component={TextField}
            name='alias'
            type='text'
            floatingLabelText='Alias'
            fullWidth
            {...styles.textField}
            {...textFieldStyles}
          />

          <div styleName='actions'>
            <Button
              styleName='button buttonDelete'
              buttonType='login'
              label={<div styleName='delete' className='chronobank-icon'>delete</div>}
            />
            <Button
              styleName='button buttonCancel'
              buttonType='flat'
              label='Cancel'
            />
            <Button
              styleName='button buttonAdd'
              buttonType='login'
              type='submit'
              label='ADD'
            />

            { error ? (<div styleName='form-error'>{error}</div>) : null }
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

export default reduxForm({ form: FORM_NETWORK_CREATE, validate }, mapStateToProps)(NetworkCreateModalForm)
