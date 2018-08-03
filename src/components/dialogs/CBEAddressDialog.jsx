/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { Button } from 'components'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { validate } from '@chronobank/core/models/CBEModel'
import { addCBE, formCBELoadName } from '@chronobank/core/redux/settings/user/cbe/actions'
import { modalsClose } from 'redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'
import validator from '@chronobank/core/models/validator'
import { FORM_CBE_ADDRESS } from 'components/constants'

import './FormDialog.scss'

function prefix (token) {
  return `components.dialogs.CBEAddressDialog.${token}`
}

function mapDispatchToProps (dispatch) {
  return {
    formCBELoadName: (e, newValue) => dispatch(formCBELoadName(newValue, FORM_CBE_ADDRESS)),
    modalsClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(addCBE(values))
    },
  }
}

function mapStateToProps (state) {
  return {
    isLoading: state.get('settingsUserCBE').isLoading,
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_CBE_ADDRESS, validate })
export default class CBEAddressDialog extends PureComponent {
  static propTypes = {
    formCBELoadName: PropTypes.func,
    name: PropTypes.string,
    isLoading: PropTypes.bool,
    modalsClose: PropTypes.func,
    ...formPropTypes,
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  handleAddressChange = (e, value) => {
    if (validator.address(value) === null) {
      this.props.formCBELoadName(e, value)
    }
  }

  render () {
    const {
      isLoading,
      initialValues,
      pristine,
      invalid,
    } = this.props

    return (
      <ModalDialog title={<Translate value={prefix('addCbeAddress')} />}>
        <form styleName='root' onSubmit={this.props.handleSubmit}>
          <div styleName='content'>
            <Field
              component={TextField}
              fullWidth
              name='address'
              floatingLabelText={<Translate value='common.ethAddress' />}
              onChange={this.handleAddressChange}
              disabled={initialValues.address() !== null}
            />
            <Field
              component={TextField}
              fullWidth
              name='name'
              style={{ width: '100%' }}
              floatingLabelText={<Translate value='common.name' />}
              disabled={isLoading}
            />
          </div>
          <div styleName='footer'>
            <Button
              flat
              styleName='action'
              label={<Translate value={prefix('cancel')} />}
              onClick={this.handleClose}
            />
            <Button
              styleName='action'
              label={<Translate value={prefix('addAddress')} />}
              disabled={isLoading || pristine || invalid}
              type='submit'
            />
          </div>
        </form>
      </ModalDialog>
    )
  }
}
