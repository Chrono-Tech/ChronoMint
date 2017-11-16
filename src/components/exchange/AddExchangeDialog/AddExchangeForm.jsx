import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import { TokenValue } from 'components'
import { RaisedButton } from 'material-ui'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import TokensCollection from 'models/exchange/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_EXCHANGE, getTokenList } from 'redux/exchange/actions'
import './AddExchangeForm.scss'
import TokenListSelector from './TokenListSelector'
import validate from './validate'

function prefix (text) {
  return `components.exchange.AddExchangeForm.${text}`
}

export const FORM_CREATE_EXCHANGE = 'createExchangeForm'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_CREATE_EXCHANGE)
  const exchange = state.get(DUCK_EXCHANGE)
  return {
    token: selector(state, 'token'),
    tokens: exchange.tokens(),
  }
}

const mapDispatchToProps = (dispatch) => ({
  getTokenList: () => dispatch(getTokenList()),
})
const onSubmit = (values) => {
  const token = values.get('token')
  return new ExchangeOrderModel({
    buyPrice: values.get('buyPrice'),
    sellPrice: values.get('sellPrice'),
    symbol: token.symbol(),
  })
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_CREATE_EXCHANGE, validate, onSubmit })
export default class AddExchangeForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    onSubmitFunc: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    getTokenList: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    ...formPropTypes,
  }

  componentDidMount () {
    this.props.getTokenList()
  }

  render () {
    const { token } = this.props
    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='dialogHeader'>
          <div styleName='dialogHeaderStuff'>
            <div styleName='dialogHeaderTitle'>
              <Translate value={prefix('dialogTitle')} />
            </div>
          </div>
        </div>
        <div styleName='dialogBody'>
          <Field
            name='token'
            component={TokenListSelector}
            tokens={this.props.tokens}
          />
          {
            token &&
            <div styleName='balanceWrapper'>
              <div styleName={classnames('tokenName', 'sm-hide')}>{token.symbol()}</div>
              <div styleName='balanceSubTitle'><Translate value={prefix('availableExchangeBalance')} /></div>
              <TokenValue
                value={new BigNumber(token.balance())}
                symbol={token.symbol()}
              />
            </div>
          }
          <div styleName='pricesWrapper'>
            <div styleName='pricesHeader'><Translate value={prefix('setThePrices')} /></div>
            <div styleName='pricesRow'>
              <Field
                component={TextField}
                name='sellPrice'
                floatingLabelText={<Translate value={prefix('sellPrice')} />}
              />
              <Field
                component={TextField}
                name='buyPrice'
                floatingLabelText={<Translate value={prefix('buyPrice')} />}
              />
            </div>
          </div>
        </div>
        <div styleName='dialogFooter'>
          <RaisedButton
            styleName='action'
            label={<Translate value={prefix('create')} />}
            type='submit'
            primary
          />
        </div>
      </form>
    )
  }
}
