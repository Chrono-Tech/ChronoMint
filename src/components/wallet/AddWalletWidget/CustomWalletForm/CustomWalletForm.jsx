/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import { Map } from 'immutable'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { createNewChildAddress, ETH, goToWallets, resetWalletsForm } from '@chronobank/core/redux/mainWallet/actions'
import { getChronobankTokens } from '@chronobank/core/redux/settings/erc20/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/EthereumDAO'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { prefix } from './lang'
import './CusotmWalletForm.scss'
import TokensList from './TokensList'

export const FORM_CUSTOM_WALLET_ADD = 'CustomWalletForm'

function mapStateToProps (state) {
  return {
    tokens: getChronobankTokens()(state),
    initialValues: {
      tokens: {
        [ETH]: true,
      },
    },
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values: Map) => {
      const tokens = Object.keys(values.get('tokens').filter((token) => token).toObject()) || []
      const name = values.get('name')
      dispatch(createNewChildAddress({ blockchain: BLOCKCHAIN_ETHEREUM, tokens, name }))
      dispatch(goToWallets())
      dispatch(resetWalletsForm())
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
    const { handleSubmit } = this.props

    return (
      <form styleName='root' onSubmit={handleSubmit}>
        <div styleName='body'>
          <div styleName='nameBlock'>
            <Field
              component={TextField}
              name='name'
              fullWidth
              floatingLabelText={<Translate value={`${prefix}.name`} />}
            />
          </div>
          <div styleName='block'>
            <div styleName='tokensList'>
              <TokensList />
            </div>
          </div>
        </div>
        <div styleName='actions'>
          <Button
            styleName='action'
            label={<Translate value={`${prefix}.addWallet`} />}
            type='submit'
          />
        </div>
      </form>
    )
  }
}
