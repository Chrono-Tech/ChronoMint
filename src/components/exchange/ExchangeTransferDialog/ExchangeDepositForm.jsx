/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button } from 'components'
import TokenValue from 'components/common/TokenValue/TokenValue'
import PropTypes from 'prop-types'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import Amount from '@chronobank/core/models/Amount'
import './ExchangeTransferDialog.scss'
import styles from './styles'
import validate from './validate'

function prefix (text) {
  return `components.exchange.ExchangeTransferDialog.${text}`
}

@reduxForm({ validate })
export default class ExchangeDepositForm extends React.PureComponent {
  static propTypes = {
    maxAmount: PropTypes.instanceOf(Amount).isRequired,
    token: PropTypes.instanceOf(TokenModel).isRequired,
    title: PropTypes.node,
    dispatch: PropTypes.func,
    ...formPropTypes,
  }

  render () {
    return (
      <div styleName='formWrapper'>
        <div styleName='subTitle'>{this.props.title}</div>
        <div>
          <Translate value={prefix('maxAmount')} />
          <TokenValue value={this.props.maxAmount} />
        </div>
        <form styleName='fieldRow' onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
          <div styleName='fieldWrapper'>
            <Field
              component={TextField}
              name='amount'
              fullWidth
              floatingLabelStyle={styles.TextField.floatingLabelStyle}
              floatingLabelText={(
                <span><Translate value={prefix('amountIn')} />&nbsp;{this.props.token.symbol()}</span>)}
              style={styles.TextField.style}
            />
          </div>
          <div styleName='actionWrapper'>
            <Button
              disabled={this.props.pristine || !this.props.valid}
              type='submit'
              label={<Translate value={prefix('sendRequest')} />}
            />
          </div>
        </form>
      </div>
    )
  }
}

