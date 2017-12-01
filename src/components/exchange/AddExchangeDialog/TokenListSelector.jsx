import iconTokenDefaultSVG from 'assets/img/avaToken.svg'
import classnames from 'classnames'
import { IPFSImage } from 'components'
import Preloader from 'components/common/Preloader/Preloader'
import { FlatButton, MenuItem } from 'material-ui'
import TokensCollection from 'models/exchange/TokensCollection'
import TokenModel from 'models/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { SelectField } from 'redux-form-material-ui'

import './AddExchangeForm.scss'

function prefix (text) {
  return `components.exchange.AddExchangeForm.${text}`
}

export default class TokenListSelector extends PureComponent {
  static propTypes = {
    tokens: PropTypes.instanceOf(TokensCollection),
    input: PropTypes.object,
    meta: PropTypes.object,
  }

  render () {
    const { tokens, token } = this.props
    const { meta } = this.props
    return (
      <div>
        <div styleName={classnames('tokenWrapperHeader', 'sm-hide')}>
          <div><Translate value={prefix('chooseToken')}/></div>
          <div styleName='tokenError'>{meta.touched && meta.error && meta.error}</div>
        </div>
        <div styleName={classnames('tokensList', 'sm-hide')}>
          {
            tokens.isFetching()
              ? <Preloader/>
              : tokens.items().map((tokenItem: TokenModel) => {
                return (
                  <div
                    key={tokenItem.symbol()}
                    styleName={classnames('tokenItem', { 'selected': token === tokenItem })}
                    onTouchTap={() => this.props.input.onChange(tokenItem)}
                  >
                    <IPFSImage multihash={tokenItem.icon()} styleName='tokenIcon' fallback={iconTokenDefaultSVG}/>
                    <div styleName='tokenTitle'>{tokenItem.symbol()}</div>
                  </div>
                )
              })
          }
        </div>
        <div styleName={classnames('tokensListMobile', 'sm-show')}>
          <IPFSImage styleName='tokenIconMobile' multihash={token && token.icon()} fallback={iconTokenDefaultSVG}/>
          <SelectField
            name='token'
            styleName='tokenMobileSelector'
            floatingLabelFixed
            floatingLabelText={<Translate value={prefix('chooseToken')}/>}
            input={this.props.input}
            meta={this.props.meta}
          >
            {
              tokens.items()
                .map((token: TokenModel) => {
                  return (<MenuItem
                    key={token.symbol()}
                    value={token}
                    primaryText={<span>{token.symbol()}</span>}
                  />)
                })}
          </SelectField>
        </div>
        <div styleName={classnames('flexRight', 'sm-hide')}>
          <FlatButton label={<Translate value={prefix('allAvailableTokens')}/>}/>
        </div>
      </div>

    )
  }
}
