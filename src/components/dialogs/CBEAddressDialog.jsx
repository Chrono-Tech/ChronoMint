import { Field, reduxForm, formPropTypes } from 'redux-form/immutable'
import { FlatButton, RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { validate } from 'models/CBEModel'
import { formCBELoadName, addCBE, FORM_CBE_ADDRESS } from 'redux/settings/user/cbe/actions'
import { modalsClose } from 'redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'
import validator from 'components/forms/validator'

import './FormDialog.scss'

function prefix (token) {
  return `components.dialogs.CBEAddressDialog.${token}`
}

function mapDispatchToProps (dispatch) {
  return {
    formCBELoadName: (e, newValue) => dispatch(formCBELoadName(newValue)),
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
      <ModalDialog>
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
            <FlatButton
              styleName='action'
              label={<Translate value={prefix('cancel')} />}
              onTouchTap={this.handleClose}
            />
            <RaisedButton
              styleName='action'
              label={<Translate value={prefix('addAddress')} />}
              primary
              disabled={isLoading || pristine || invalid}
              type='submit'
            />
          </div>
        </form>
      </ModalDialog>
    )
  }
}
