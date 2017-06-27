import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'

import FileSelect from '../../../common/FileSelect/FileSelect'
import TokenModel, { validate } from '../../../../models/TokenModel'

import { formTokenLoadMetaData } from '../../../../redux/settings/erc20Manager/tokens'

export const FORM_SETTINGS_TOKEN = 'SettingsTokenForm'

const mapStateToProps = (state) => {
  const model: TokenModel = state.get('settingsERC20Tokens').selected
  return {
    initialValues: model, // TODO @bshevchenko: Probably fix will needed after MINT-277 Improve FileSelect
    isFetching: state.get('settingsERC20Tokens').formFetching
  }
}

@connect(mapStateToProps, null, null, {withRef: true})
// noinspection JSUnusedGlobalSymbols
@reduxForm({form: FORM_SETTINGS_TOKEN, validate, asyncValidate: (token: TokenModel, dispatch) => {
  return formTokenLoadMetaData(token, dispatch)
}, asyncBlurFields: ['address', 'symbol']})
class TokenForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field component={TextField}
               name='address'
               style={{width: '100%'}}
               disabled={this.props.isFetching}
               floatingLabelText={<Translate value='common.ethAddress'/>}
               onChange={this.props.handleAddressChange}
        />
        <Field component={TextField}
               name='name'
               style={{width: '100%'}}
               disabled={this.props.isFetching}
               floatingLabelText={<Translate value='common.name'/>}
        />
        <Field component={TextField}
               name='symbol'
               style={{width: '100%'}}
               disabled={this.props.isFetching}
               floatingLabelText={<Translate value='settings.erc20.tokens.symbol'/>}
        />
        <Field component={TextField}
               name='decimals'
               style={{width: '100%'}}
               disabled={this.props.isFetching}
               floatingLabelText={<Translate value='settings.erc20.tokens.decimals'/>}
        />
        <Field component={TextField}
               name='url'
               style={{width: '100%'}}
               floatingLabelText={<Translate value='settings.erc20.tokens.url'/>}
        />
        {/* TODO @bshevchenko: provide permitted file types, image size and field title when MINT-277 Improve FileSelect will be done */}
        <Field
          component={FileSelect}
          name='icon'
          value={this.props.initialValues.get('icon')}
          fullWidth
        />
      </form>
    )
  }
}

export default TokenForm
