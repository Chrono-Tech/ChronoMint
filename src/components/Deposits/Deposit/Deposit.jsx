/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import Amount from 'models/Amount'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { TIME } from 'redux/mainWallet/actions'
import { getDeposit } from 'redux/mainWallet/selectors'
import { Button, IPFSImage, TokenValue } from 'components'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokenModel from 'models/tokens/TokenModel'
import { TOKEN_ICONS } from 'assets'
import { prefix } from './lang'
import './Deposit.scss'

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  return {
    deposit: getDeposit(TIME)(state),
    token: tokens.item(TIME),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Deposit extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
  }

  render () {
    const { deposit, token } = this.props
    return (
      <div styleName='root'>
        <div styleName='depositItem'>
          <div styleName='iconWrapper'>
            <div styleName='icon'>
              <IPFSImage
                styleName='iconImg'
                multihash={token.icon()}
                fallback={TOKEN_ICONS[ token.symbol() ]}
              />
            </div>
          </div>
          <div styleName='itemContent'>
            <div styleName='title'><Translate value={`${prefix}.title`} /></div>
            <div styleName='address'>{token.address()}</div>
            <div styleName='amount'><TokenValue value={deposit} noRenderPrice /></div>
            <div styleName='price'><TokenValue value={deposit} renderOnlyPrice /></div>
            <div styleName='actions'>
              <Button styleName='action'><Translate value={`${prefix}.withdraw`} /></Button>
              <Button styleName='action'><Translate value={`${prefix}.deposit`} /></Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
