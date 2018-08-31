/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Toggle } from 'redux-form-material-ui'
import { Field } from 'redux-form/immutable'
import { getChronobankTokens } from '@chronobank/core/redux/settings/erc20/tokens/selectors'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { TOKEN_ICONS } from 'assets'

import './TokensList.scss'

function mapStateToProps (state, props) {

  return {
    tokens: getChronobankTokens()(state),
  }
}

@connect(mapStateToProps)
export default class TokensList extends PureComponent {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.instanceOf(TokenModel)),
  }

  render () {
    const { tokens } = this.props

    return (
      <div>
        {tokens.map((token) => (
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
