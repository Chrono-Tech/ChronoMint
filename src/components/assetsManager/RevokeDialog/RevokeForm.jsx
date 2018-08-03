/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'components'
import { TextField } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'
import {  revokeAsset } from '@chronobank/core/redux/assetsManager/actions'
import { DUCK_ASSETS_MANAGER } from '@chronobank/core/redux/assetsManager/constants'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import { FORM_NAME } from 'components/constants'
import validate from './validate'
import './RevokeForm.scss'

export const prefix = (token) => {
  return `Assets.RevokeForm.${token}`
}

function mapStateToProps (state) {
  const form = state.get('form')
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  const tokens = state.get(DUCK_TOKENS)
  return {
    formErrors: form.get(FORM_NAME) && form.get(FORM_NAME).get('syncErrors'),
    selectedToken: assetsManager.selectedToken(),
    tokens,
  }
}

const onSubmit = (values, dispatch, props) => {
  dispatch(revokeAsset(props.tokens.item(props.selectedToken), values.get('amount')))
}

@connect(mapStateToProps)
@reduxForm({ form: FORM_NAME, validate, onSubmit })
export default class AddPlatformForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    formErrors: PropTypes.object,
    onSubmitSuccess: PropTypes.func,
    selectedToken: PropTypes.string,
    tokens: PropTypes.instanceOf(TokensCollection),
  }

  render () {
    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='dialogBody'>

          <Field
            component={TextField}
            name='amount'
            fullWidth
            floatingLabelText={<Translate value={prefix('amount')} />}
          />

        </div>
        <div styleName='dialogFooter'>
          <Button
            disabled={!!this.props.formErrors}
            styleName='action'
            label={<Translate value={prefix('dialogTitle')} />}
            type='submit'
          />
        </div>
      </form>
    )
  }
}
