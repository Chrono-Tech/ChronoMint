/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { I18n } from '@chronobank/core-dependencies/i18n/index'
import Button from 'components/common/ui/Button/Button'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { ACCEPT_IMAGES } from '@chronobank/core/models/FileSelect/FileExtension'
import { addToken, formTokenLoadMetaData, getDataFromContract, modifyToken } from '@chronobank/core/redux/settings/erc20/tokens/actions'
import { DUCK_SETTINGS_ERC20_TOKENS } from '@chronobank/core/redux/settings/erc20/tokens/constants'
import { modalsClose } from 'redux/modals/actions'
import FileSelect from 'components/common/FileSelect/FileSelect'
import ModalDialog from 'components/dialogs/ModalDialog'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import { FORM_CBE_TOKEN } from 'components/constants'
import validate from './validate'

import '../FormDialog.scss'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_CBE_TOKEN)
  return {
    isFetching: state.get(DUCK_SETTINGS_ERC20_TOKENS).formFetching,
    address: selector(state, 'address'),
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onClose: () => dispatch(modalsClose()),
    handleDataFromContract: (e, address) => dispatch(getDataFromContract(new TokenModel({ address }))),
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
  asyncValidate: (token, dispatch, props) => formTokenLoadMetaData(token, dispatch, props),
  asyncBlurFields: [ 'address', 'symbol', 'decimals' ],
})
export default class CBETokenDialog extends PureComponent {
  static propTypes = {
    isModify: PropTypes.bool,
    isFetching: PropTypes.bool,
    handleAddressChange: PropTypes.func,
    onClose: PropTypes.func,
    address: PropTypes.string,
    tokens: PropTypes.instanceOf(TokensCollection),
    getDataFromContract: PropTypes.func,
    ...formPropTypes,
  }

  render () {
    return (
      <ModalDialog onClose={this.props.onClose} title={<Translate value={this.props.isModify ? 'settings.erc20.tokens.modify' : 'settings.erc20.tokens.add'} />}>
        <form styleName='root' onSubmit={this.props.handleSubmit}>
          <div styleName='content'>
            <Field
              component={TextField}
              name='address'
              fullWidth
              disabled={this.props.isFetching}
              floatingLabelText={<Translate value='common.ethAddress' />}
              onBlur={this.props.handleDataFromContract}
            />
            {
              this.props.address &&
              <div>
                <Field
                  component={TextField}
                  name='name'
                  fullWidth
                  disabled={this.props.isFetching}
                  floatingLabelText={<Translate value='common.name' />}
                />
                <Field
                  component={TextField}
                  name='symbol'
                  fullWidth
                  disabled={this.props.isFetching}
                  floatingLabelText={<Translate value='settings.erc20.tokens.symbol' />}
                />
                <Field
                  component={TextField}
                  name='decimals'
                  fullWidth
                  disabled={this.props.isFetching}
                  floatingLabelText={<Translate value='settings.erc20.tokens.decimals' />}
                />
                <Field
                  component={TextField}
                  name='url'
                  fullWidth
                  floatingLabelText={<Translate value='settings.erc20.tokens.url' />}
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
            }
          </div>
          <div styleName='footer'>
            <Button flat styleName='action' label='Cancel' onClick={this.props.onClose} />
            <Button
              disabled={this.props.isFetching || this.props.pristine || this.props.invalid}
              styleName='action'
              label={<Translate
                value={this.props.isModify ? 'settings.erc20.tokens.modify' : 'settings.erc20.tokens.add'}
              />}
              type='submit'
            />
          </div>
        </form>
      </ModalDialog>
    )
  }
}
