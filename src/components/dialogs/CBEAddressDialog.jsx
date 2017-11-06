import { Field, reduxForm, formPropTypes } from 'redux-form/immutable'
import { FlatButton, RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { validate } from 'models/CBEModel'
import { formCBELoadName, addCBE } from 'redux/settings/user/cbe/actions'
import { modalsClose } from 'redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'
import validator from 'components/forms/validator'
import './FormDialog.scss'

export const FORM_CBE_ADDRESS = 'CBEAddressDialog'

function prefix (token) {
  return `components.dialogs.CBEAddressDialog.${token}`
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddressChange: (e, newValue) => validator.address(newValue) === null ? dispatch(formCBELoadName(newValue)) : false,
    onClose: () => dispatch(modalsClose()),
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
    handleAddressChange: PropTypes.func,
    // You need both handleSubmit and onSubmit
    name: PropTypes.string,
    onClose: PropTypes.func,
    isLoading: PropTypes.bool,
  } & formPropTypes

  render () {
    const {
      isLoading,
      onClose,
      handleSubmit,
      handleAddressChange,
      initialValues,
      pristine,
      invalid,
    } = this.props

    return (
      <ModalDialog onClose={() => onClose()}>
        <form styleName='root' onSubmit={handleSubmit}>
          <div styleName='header'>
            <h3 styleName='title'><Translate value={prefix('addCbeAddress')} /></h3>
          </div>
          <div styleName='content'>
            <Field
              component={TextField}
              fullWidth
              name='address'
              floatingLabelText={<Translate value='common.ethAddress' />}
              onChange={(e, newValue) => handleAddressChange(e, newValue)}
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
              onTouchTap={() => onClose()}
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
