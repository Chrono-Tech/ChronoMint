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
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import {
  FORM_NETWORK_CREATE,
} from '../../../redux/constants'
import validate from './validate'
import styles from './styles'
import './NetworkCreateModalForm.scss'

class NetworkCreateModalForm extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func,
    handleDeleteNetwork: PropTypes.func,
  }

  render () {
    const {
      classes,
      error,
      handleDeleteNetwork,
      handleSubmit,
      network,
      onCloseModal,
    } = this.props

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
          inputProps={{ className: classes.inputStyle }}
          InputLabelProps={{ className: classes.label }}
          className={classes.style}
        />

        <Field
          component={TextField}
          name='ws'
          type='text'
          label={
            <Translate value='NetworkCreateModalForm.socket' />
          }
          fullWidth
          inputProps={{ className: classes.inputStyle }}
          InputLabelProps={{ className: classes.label }}
          className={classes.style}
        />

        <Field
          component={TextField}
          name='alias'
          type='text'
          styleName='field'
          label={
            <Translate value='NetworkCreateModalForm.alias' />
          }
          fullWidth
          inputProps={{ className: classes.inputStyle }}
          InputLabelProps={{ className: classes.label }}
          className={classes.style}
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
            label={
              network
                ? <Translate value='NetworkCreateModalForm.save' />
                : <Translate value='NetworkCreateModalForm.add' />
            }
          />

          { error ? (<div styleName='form-error'>{error}</div>) : null }
        </div>

      </form>
    )
  }
}

const form = reduxForm({ form: FORM_NETWORK_CREATE, validate })(NetworkCreateModalForm)
export default compose(withStyles(styles))(form)
