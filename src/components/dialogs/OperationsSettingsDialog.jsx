import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { Field, reduxForm } from 'redux-form/immutable'
import { CSSTransitionGroup } from 'react-transition-group'
import { TextField } from 'redux-form-material-ui'
import { FlatButton, RaisedButton } from 'material-ui'

import ModalDialog from 'components/dialogs/ModalDialog'
import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'

import { setRequiredSignatures } from 'redux/operations/actions'
import { modalsClose } from 'redux/modals/actions'

import './FormDialog.scss'

export const FORM_OPERATION_SETTINGS = 'OperationSettingsDialog'

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
  }
})
export default class OperationsSettingsDialog extends Component {

  static propTypes = {
    adminCount: PropTypes.number,
    initialValues: PropTypes.object,
    handleAddressChange: PropTypes.func,
    // You need both handleSubmit and onSubmit
    name: PropTypes.string,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog
          onClose={() => this.props.onClose()}
        >
          <form styleName='root' onSubmit={this.props.handleSubmit}>
            <div styleName='header'>
              <h3 styleName='title'>Operations Settings</h3>
            </div>
            <div styleName='content'>
              <div>
                <p>{I18n.t('operations.adminCount')}: <b>{this.props.adminCount}</b></p>
              </div>
              <Field component={TextField}
                name='requiredSigns'
                fullWidth
                floatingLabelText={I18n.t('operations.requiredSigns')}
              />
            </div>
            <div styleName='footer'>
              <FlatButton styleName='action' label='Cancel' onTouchTap={() => this.props.onClose()} />
              <RaisedButton styleName='action' label='Save' primary type='submit' />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapStateToProps (state) {
  const operations = state.get('operations')
  return {
    adminCount: operations.adminCount,
    initialValues: {
      requiredSigns: operations.required,
      adminCount: operations.adminCount
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(setRequiredSignatures(parseInt(values.get('requiredSigns'), 10)))
    }
  }
}
