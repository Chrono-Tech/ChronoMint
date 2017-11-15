import avaTokenSVG from 'assets/img/avaToken.svg'
import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import { IPFSImage, TokenValue } from 'components'
import Preloader from 'components/common/Preloader/Preloader'
import { FlatButton, MenuItem, RaisedButton } from 'material-ui'
import TokensCollection from 'models/exchange/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { SelectField, TextField } from 'redux-form-material-ui'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_EXCHANGE, getTokenList, getAssetBalance } from 'redux/exchange/actions'
import TokenModel from 'models/TokenModel'

import './AddExchangeForm.scss'
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
  getAssetBalance: (token: TokenModel) => dispatch(getAssetBalance(token)),
})
const onSubmit = (values, dispatch) => {
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
    getAssetBalance: PropTypes.func,
    ...formPropTypes,
  }

  componentDidMount () {
    this.props.getTokenList()
  }

  handleSelectToken (token: TokenModel) {
    this.props.getAssetBalance(token)
    this.props.dispatch(change(FORM_CREATE_EXCHANGE, 'token', token.symbol()))
  }

  renderTokens () {
    if (this.props.tokens.isFetching()) {
      return <Preloader />
    }

    return this.props.tokens.items().map((token: TokenModel) => {
      return (
        <div
          key={token.symbol()}
          styleName={classnames('tokenItem', { 'selected': this.props.token === token.symbol() })}
          onTouchTap={() => this.handleSelectToken(token)}
        >
          <IPFSImage multihash={token.icon()} styleName='tokenIcon' fallback={avaTokenSVG} />
          <div styleName='tokenTitle'>{token.symbol()}</div>
        </div>
      )
    })
  }

  render () {
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
          <div styleName='tokenWrapper'>
            <div styleName={classnames('tokenWrapperHeader', 'sm-hide')}><Translate value={prefix('chooseToken')} />
            </div>
            <div styleName={classnames('tokensList', 'sm-hide')}>
              {this.renderTokens()}
            </div>
            <div styleName={classnames('tokensListMobile', 'sm-show')}>
              <IPFSImage styleName='tokenIconMobile' fallback={require('../../../assets/img/icn-time.svg')} />
              <Field
                name='token'
                styleName='tokenMobileSelector'
                component={SelectField}
                floatingLabelFixed
                floatingLabelText={<Translate value={prefix('chooseToken')} />}
              >
                {
                  this.props.tokens.items()
                    .map((token: TokenModel) => {
                      // eslint-disable-next-line
                      console.log('--AddExchangeForm#token', token)
                      return (<MenuItem
                        key={token.symbol()}
                        value={token.symbol()}
                        primaryText={
                          <span styleName='tokenSelectorItem'>{token.symbol()}</span>
                        }
                      />)
                    })}
              </Field>
            </div>
            <div styleName={classnames('flexRight', 'sm-hide')}>
              <FlatButton label={<Translate value={prefix('allAvailableTokens')} />} />
            </div>
          </div>
          <div styleName='balanceWrapper'>
            <div styleName={classnames('tokenName', 'sm-hide')}>TIME</div>
            <div styleName='balanceSubTitle'><Translate value={prefix('availableExchangeBalance')} /></div>
            <TokenValue
              value={new BigNumber(1234.124)}
              symbol='TIME'
            />
          </div>
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
        <div
          styleName='dialogFooter'
        >
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
