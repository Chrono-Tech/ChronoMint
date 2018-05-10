/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Toggle } from 'redux-form-material-ui'
import { change, Field, formValueSelector } from 'redux-form/immutable'
import { getChronobankTokens } from 'redux/settings/erc20/tokens/selectors'
import TokenModel from 'models/tokens/TokenModel'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { TOKEN_ICONS } from 'assets'

import './TokensList.scss'

const FIELD_NEW_ADDRESS = 'newOwnerAddress'

function mapStateToProps (state, props) {
  const selector = formValueSelector(props.meta.form)

  return {
    tokens: getChronobankTokens()(state),
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    resetForm: () => dispatch(change(props.meta.form, FIELD_NEW_ADDRESS, '')),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class TokensList extends PureComponent {
  static propTypes = {
    resetForm: PropTypes.func,
    tokens: PropTypes.arrayOf(PropTypes.instanceOf(TokenModel)),
  }

  render () {
    const { tokens } = this.props

    return (
      <div>
        {tokens.map((token) => (
          <div key={token.id()} styleName='tokenBlock'>
            <div styleName='icon'><IPFSImage multihash={token.icon()} fallback={TOKEN_ICONS[ token.symbol() ] || TOKEN_ICONS.DEFAULT} /></div>
            <div styleName='title'>{token.name() || token.symbol()}</div>
            <div styleName='field'>
              <Field
                component={Toggle}
                name={`${token.id()}`}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }
}
