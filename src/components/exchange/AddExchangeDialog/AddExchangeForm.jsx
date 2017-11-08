import BigNumber from 'bignumber.js'
import { Field, reduxForm, formPropTypes, change, formValueSelector } from 'redux-form/immutable'
import { IPFSImage, TokenValue } from 'components'
import PropTypes from 'prop-types'
import { RaisedButton, FlatButton, MenuItem } from 'material-ui'
import React, { PureComponent } from 'react'
import { TextField, SelectField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import validate from './validate'

import './AddExchangeForm.scss'

// TODO @abdulov remove it
let tokens = []
for (let i = 0; i < 16; i++) {
  tokens.push('')
}

function prefix (text) {
  return `components.exchange.AddExchangeForm.${text}`
}

export const FORM_CREATE_EXCHANGE = 'createExchangeForm'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_CREATE_EXCHANGE)
  return {
    token: selector(state, 'token'),
  }
}

const onSubmit = (values, dispatch) => {
}

@connect(mapStateToProps)
@reduxForm({ form: FORM_CREATE_EXCHANGE, validate, onSubmit })
export default class AddExchangeForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    onSubmitFunc: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    ...formPropTypes,
  }

  renderTokens () {
    return tokens.map((item, i) => {
      return (
        <div
          key={i}
          styleName={classnames('tokenItem', { 'selected': this.props.token === `TIME${i}` })}
          onTouchTap={() => {
            this.props.dispatch(change(FORM_CREATE_EXCHANGE, 'token', `TIME${i}`))
          }}
        >
          <IPFSImage styleName='tokenIcon' fallback={require('../../../assets/img/icn-time.svg')} />
          <div styleName='tokenTitle'>TIMETIMETIMETIME</div>
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
                  tokens
                    .map((token, i) => {
                      return (<MenuItem
                        key={i}
                        value={`TIME${i}`}
                        primaryText={
                          <span styleName='tokenSelectorItem'>TIME</span>
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
