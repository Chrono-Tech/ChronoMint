/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { FieldArray, formPropTypes, reduxForm } from 'redux-form/immutable'
import { goToWallets } from 'redux/mainWallet/actions'
import { getChronobankTokens } from 'redux/settings/erc20/tokens/selectors'
import TokenModel from 'models/tokens/TokenModel'
import { prefix } from './lang'
import './CusotmWalletForm.scss'
import TokensList from './TokensList'

export const FORM_CUSTOM_WALLET_ADD = 'CustomWalletForm'

function mapStateToProps (state, ownProps) {
  return {
    tokens: getChronobankTokens()(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values, dispatch, props) => {
      dispatch(goToWallets())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_CUSTOM_WALLET_ADD })
export default class CustomWalletForm extends PureComponent {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.instanceOf(TokenModel)),
    ...formPropTypes,
  }

  render () {
    const { handleSubmit, pristine, valid } = this.props

    return (
      <form styleName='root' onSubmit={handleSubmit}>
        <div styleName='body'>
          <div styleName='block'>
            <div styleName='tokensList'>
              <FieldArray
                component={TokensList}
                name='tokens'
              />
            </div>
          </div>
        </div>
        <div styleName='actions'>
          <Button
            styleName='action'
            label={<Translate value={`${prefix}.addWallet`} />}
            type='submit'
            disabled={pristine || !valid}
          />
        </div>
      </form>
    )
  }
}
