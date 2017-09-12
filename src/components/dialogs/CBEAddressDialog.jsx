import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Field, reduxForm } from 'redux-form/immutable'
import { CSSTransitionGroup } from 'react-transition-group'
import { TextField } from 'redux-form-material-ui'
import { FlatButton, RaisedButton } from 'material-ui'

import ModalDialog from 'components/dialogs/ModalDialog'
import validator from 'components/forms/validator'

import { validate } from 'models/CBEModel'
import { formCBELoadName, addCBE } from 'redux/settings/user/cbe/actions'
import { modalsClose } from 'redux/modals/actions'

import './FormDialog.scss'

export const FORM_CBE_ADDRESS = 'CBEAddressDialog'

function prefix (token) {
  return 'components.dialogs.CBEAddressDialog.' + token
}

@connect(null, mapDispatchToProps)
@reduxForm({form: FORM_CBE_ADDRESS, validate})
export default class CBEAddressDialog extends Component {

  static propTypes = {
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
              <h3 styleName='title'><Translate value={prefix('addCbeAddress')} /></h3>
            </div>
            <div styleName='content'>
              <Field
                component={TextField}
                fullWidth
                name='address'
                floatingLabelText={<Translate value='common.ethAddress' />}
                onChange={(e, newValue) => this.props.handleAddressChange(e, newValue)}
                disabled={this.props.initialValues.address() !== null}
              />
              <Field
                component={TextField}
                fullWidth
                name='name'
                style={{width: '100%'}}
                floatingLabelText={<Translate value='common.name' />}
              />
            </div>
            <div styleName='footer'>
              <FlatButton styleName='action' label={<Translate value={prefix('cancel')} />} onTouchTap={() => this.props.onClose()} />
              <RaisedButton styleName='action' label={<Translate value={prefix('addAddress')} />} primary type='submit' />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddressChange: (e, newValue) => validator.address(newValue) === null ? dispatch(formCBELoadName(newValue)) : false,
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(addCBE(values))
    }
  }
}
