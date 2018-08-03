/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Field, reduxForm, reset } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { Button } from 'components'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { reissueAsset } from '@chronobank/core/redux/assetsManager/actions'
import {
  FORM_REISSUE_FORM,
} from 'components/constants'
import { DUCK_ASSETS_MANAGER } from '@chronobank/core/redux/assetsManager/constants'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import validate from './validate'

import './ReissueAssetForm.scss'

function prefix (token) {
  return `Assets.ReissueAssetForm.${token}`
}

function mapStateToProps (state) {
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  const tokens = state.get(DUCK_TOKENS)
  return {
    selectedToken: assetsManager.selectedToken(),
    tokens,
  }
}

const onSubmit = (values, dispatch, props) => {
  dispatch(reissueAsset(props.tokens.item(props.selectedToken), values.get('amount')))
  dispatch(reset(FORM_REISSUE_FORM))
}

@connect(mapStateToProps)
@reduxForm({ form: FORM_REISSUE_FORM, validate, onSubmit })
export default class ReissueAssetForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
  }

  render () {
    return (
      <div styleName='reissueRow'>
        <form onSubmit={this.props.handleSubmit}>
          <div styleName='input'>
            <Field
              component={TextField}
              fullWidth
              name='amount'
              style={{ width: '100%' }}
              floatingLabelText={<Translate value={prefix('reissueAmount')} />}
            />
          </div>
          <Button
            type='submit'
            label={<Translate value={prefix('reissue')} />}
            styleName='action'
          />
        </form>
      </div>
    )
  }
}

