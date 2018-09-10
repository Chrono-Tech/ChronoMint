/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import Button from 'components/common/ui/Button/Button'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { ACCEPT_IMAGES } from '@chronobank/core/models/FileSelect/FileExtension'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { addToken, formTokenLoadMetaData } from '@chronobank/core/redux/settings/erc20/tokens/actions'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import FileSelect from 'components/common/FileSelect/FileSelect'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokenIcon from 'components/common/HashedIcon/TokenIcon'
import ProfileModel from '@chronobank/core/models/ProfileModel'
import { FORM_ADD_TOKEN_DIALOG } from 'components/constants'
import ModalDialog from '../ModalDialog'
import validate, { normalizeSmallestUnit } from './validate'

import './AddTokenDialog.scss'

const asyncValidate = (values, dispatch, props) => {
  try {
    return dispatch(formTokenLoadMetaData(new TokenModel(values), props))
  } catch (e) {
    throw e
  }
}

function prefix (token) {
  return `components.dialogs.AddTokenDialog.${token}`
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_ADD_TOKEN_DIALOG)
  const { account, profile } = state.get(DUCK_SESSION)
  const tokens = state.get(DUCK_TOKENS)

  return {
    address: selector(state, 'address'),
    name: selector(state, 'name'),
    icon: selector(state, 'icon'),
    symbol: selector(state, 'symbol'),
    account: account,
    profile: profile,
    isTokensLoaded: !tokens.isFetching(),
    tokens,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(addToken(new TokenModel(values)))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_ADD_TOKEN_DIALOG, validate, asyncValidate })
export default class AddTokenDialog extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.instanceOf(ProfileModel),
    modalsClose: PropTypes.func,
    address: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
    symbol: PropTypes.string,
    ...formPropTypes,
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  render () {
    return (
      <ModalDialog styleName='root' hideCloseIcon>
        <form styleName='content' onSubmit={this.props.handleSubmit}>
          <div styleName='header'>
            <div styleName='left'>
              <div styleName='icon'>
                <IPFSImage
                  styleName='iconContent'
                  multihash={this.props.icon}
                  fallbackComponent={<TokenIcon token={this.props.symbol} />}
                />
              </div>
            </div>
            <div styleName='right'>
              <div styleName='name'>{this.props.name || <Translate value={prefix('tokenNameHead')} />}</div>
              <div styleName='address'>{this.props.address || <Translate value={prefix('tokenAddressHead')} />}</div>
            </div>
          </div>
          <div styleName='body'>
            <Field
              component={TextField}
              name='address'
              fullWidth
              label={<Translate value={prefix('tokenContractAddress')} />}
            />
            <Field
              component={TextField}
              name='name'
              fullWidth
              label={<Translate value={prefix('tokenName')} />}
            />
            <Field
              component={TextField}
              name='symbol'
              fullWidth
              label={<Translate value={prefix('tokenSymbol')} />}
            />
            <Field
              component={TextField}
              name='decimals'
              fullWidth
              label={<Translate value={prefix('decimalsPlacesOfSmallestUnit')} />}
              normalize={normalizeSmallestUnit}
            />
            <Field
              component={TextField}
              name='url'
              fullWidth
              label={<Translate value={prefix('projectURL')} />}
            />
            <Field
              component={FileSelect}
              name='icon'
              fullWidth
              label='wallet.selectTokenIcon'
              accept={ACCEPT_IMAGES}
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
              label={<Translate value={prefix('save')} />}
              type='submit'
              disabled={this.props.submitting}
            />
          </div>
        </form>
      </ModalDialog>
    )
  }
}
