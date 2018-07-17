/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TextField, Toggle } from 'redux-form-material-ui'
import { I18n } from '@chronobank/core-dependencies/i18n/index'
import { Field } from 'redux-form/immutable'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { TOKEN_ICONS } from 'assets'
import { prefix } from './lang'

import './TokensList.scss'

export default class TokensList extends PureComponent {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.instanceOf(TokenModel)),
    filter: PropTypes.string,
  }
  static defaultProps = {
    filter: '',
  }

  render () {
    const { tokens, filter } = this.props
    const filterLC = filter ? filter.toLowerCase() : ''

    return (
      <div>
        <div styleName='tokensFilter'>
          <div styleName='icon'><i className='chronobank-icon'>search</i></div>
          <div styleName='field'>
            <Field
              component={TextField}
              underlineShow={false}
              name='filter'
              fullWidth
              placeholder={I18n.t(`${prefix}.filter`)}
            />
          </div>
        </div>
        {tokens
          .filter((token) => token.symbol().toLowerCase().includes(filterLC))
          .map((token) => (
            <div key={token.id()} styleName='tokenBlock'>
              <div styleName='icon'><IPFSImage multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()] || TOKEN_ICONS.DEFAULT} /></div>
              <div styleName='title'>{token.name() || token.symbol()}</div>
              <div styleName='field'>
                <Field
                  component={Toggle}
                  name={`tokens.${token.id()}`}
                />
              </div>
            </div>
          ))}
      </div>
    )
  }
}
