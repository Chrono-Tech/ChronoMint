import BigNumber from 'bignumber.js'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import './ExchangeTransferDialog.scss'
import styles from './styles'
import validate from './validate'

function prefix (token) {
  return `components.exchange.ExchangeTransferDialog.${token}`
}

@reduxForm({ validate })
export default class ExchangeDepositForm extends React.PureComponent {
  static propTypes = {
    maxAmount: PropTypes.instanceOf(BigNumber).isRequired,
    symbol: PropTypes.string.isRequired,
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
          <TokenValue
            value={this.props.maxAmount}
            symbol={this.props.symbol}
          />
        </div>
        <form styleName='fieldRow' onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
          <div styleName='fieldWrapper'>
            <Field
              component={TextField}
              name='amount'
              fullWidth
              floatingLabelStyle={styles.TextField.floatingLabelStyle}
              floatingLabelText={(
                <span><Translate value={prefix('amountIn')} />&nbsp;{this.props.symbol}</span>)}
              style={styles.TextField.style}
            />
          </div>
          <div styleName='actionWrapper'>
            <RaisedButton
              type='submit'
              label={<Translate value={prefix('sendRequest')} />}
              primary
            />
          </div>
        </form>
      </div>
    )
  }
}

