import { Field, reduxForm, formPropTypes } from 'redux-form/immutable'
import { FlatButton, RaisedButton } from 'material-ui'
import { I18n } from 'platform/i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { ACCEPT_IMAGES } from 'models/FileSelect/FileExtension'
import { validate } from 'models/tokens/TokenModel'
import { formTokenLoadMetaData, addToken, modifyToken } from 'redux/settings/erc20/tokens/actions'
import { modalsClose } from 'redux/modals/actions'
import FileSelect from 'components/common/FileSelect/FileSelect'
import ModalDialog from 'components/dialogs/ModalDialog'

import './FormDialog.scss'

export const FORM_CBE_TOKEN = 'CBETokenDialog'

function mapStateToProps (state) {
  return {
    isFetching: state.get('settingsERC20Tokens').formFetching,
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      if (ownProps.isModify) {
        dispatch(modifyToken(ownProps.initialValues, values))
      } else {
        dispatch(addToken(values))
      }
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({
  form: FORM_CBE_TOKEN,
  validate,
  asyncValidate: (token, dispatch) => formTokenLoadMetaData(token, dispatch, FORM_CBE_TOKEN),
  asyncBlurFields: ['address', 'symbol'],
})
export default class CBETokenDialog extends PureComponent {
  static propTypes = {
    isModify: PropTypes.bool,
    isFetching: PropTypes.bool,
    handleAddressChange: PropTypes.func,
    onClose: PropTypes.func,
    ...formPropTypes,
  }

  render () {
    return (
      <ModalDialog
        onClose={() => this.props.onClose()}
      >
        <form styleName='root' onSubmit={this.props.handleSubmit}>
          <div styleName='header'>
            <h3 styleName='title'>{I18n.t(this.props.isModify ? 'settings.erc20.tokens.modify' : 'settings.erc20.tokens.add')}</h3>
          </div>
          <div styleName='content'>
            <Field
              component={TextField}
              name='address'
              fullWidth
              disabled={this.props.isFetching}
              floatingLabelText={I18n.t('common.ethAddress')}
            />
            <Field
              component={TextField}
              name='name'
              fullWidth
              disabled={this.props.isFetching}
              floatingLabelText={I18n.t('common.name')}
            />
            <Field
              component={TextField}
              name='symbol'
              fullWidth
              disabled={this.props.isFetching}
              floatingLabelText={I18n.t('settings.erc20.tokens.symbol')}
            />
            <Field
              component={TextField}
              name='decimals'
              fullWidth
              disabled={this.props.isFetching}
              floatingLabelText={I18n.t('settings.erc20.tokens.decimals')}
            />
            <Field
              component={TextField}
              name='url'
              fullWidth
              floatingLabelText={I18n.t('settings.erc20.tokens.url')}
            />
            <Field
              component={FileSelect}
              name='icon'
              value={this.props.initialValues.icon()}
              fullWidth
              label={I18n.t('wallet.selectTokenIcon')}
              accept={ACCEPT_IMAGES}
            />
          </div>
          <div styleName='footer'>
            <FlatButton styleName='action' label='Cancel' onTouchTap={() => this.props.onClose()} />
            <RaisedButton
              styleName='action'
              label={I18n.t(this.props.isModify ? 'settings.erc20.tokens.modify' : 'settings.erc20.tokens.add')}
              primary
              type='submit'
            />
          </div>
        </form>
      </ModalDialog>
    )
  }
}
