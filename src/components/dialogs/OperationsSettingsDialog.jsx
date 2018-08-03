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
import { modalsClose } from 'redux/modals/actions'
import { setRequiredSignatures } from '@chronobank/core/redux/operations/actions'
import ErrorList from '@chronobank/core-dependencies/ErrorList'
import ModalDialog from 'components/dialogs/ModalDialog'
import validator from '@chronobank/core/models/validator'
import { FORM_OPERATION_SETTINGS } from 'components/constants'

import './FormDialog.scss'

function prefix (token) {
  return `components.dialogs.OperationsSettingsDialog.${token}`
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({
  form: FORM_OPERATION_SETTINGS,
  validate: (values) => { // TODO async validate
    const errors = {}
    errors.requiredSigns = ErrorList.toTranslate(validator.positiveInt(values.get('requiredSigns')))
    if (!errors.requiredSigns && parseInt(values.get('requiredSigns'), 10) > parseInt(values.get('adminCount'), 10)) {
      errors.requiredSigns = ErrorList.toTranslate('operations.errors.requiredSigns')
    }
    return errors
  },
})
export default class OperationsSettingsDialog extends PureComponent {
  static propTypes = {
    adminCount: PropTypes.number,
    handleAddressChange: PropTypes.func,
    name: PropTypes.string,
    onClose: PropTypes.func,
    ...formPropTypes,
  }

  render () {
    return (
      <ModalDialog onClose={() => this.props.onClose()} title={<Translate value={prefix('operationsSettings')} />}>
        <form styleName='root' onSubmit={this.props.handleSubmit}>
          <div styleName='content'>
            <div>
              <p>{<Translate value='operations.adminCount' />}: <b>{this.props.adminCount}</b></p>
            </div>
            <Field
              component={TextField}
              name='requiredSigns'
              fullWidth
              floatingLabelText={<Translate value='operations.requiredSigns' />}
            />
          </div>
          <div styleName='footer'>
            <Button flat styleName='action' label={<Translate value={prefix('cancel')} />} onClick={() => this.props.onClose()} />
            <Button styleName='action' label={<Translate value={prefix('save')} />} type='submit' />
          </div>
        </form>
      </ModalDialog>
    )
  }
}

function mapStateToProps (state) {
  const operations = state.get('operations')
  return {
    adminCount: operations.adminCount,
    initialValues: {
      requiredSigns: operations.required,
      adminCount: operations.adminCount,
    },
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(setRequiredSignatures(parseInt(values.get('requiredSigns'), 10)))
    },
  }
}

