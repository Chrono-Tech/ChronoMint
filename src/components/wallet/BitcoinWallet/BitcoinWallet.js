/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TOKEN_ICONS } from 'assets'
import Button from '../../common/ui/Button/Button'
import IPFSImage from '../../common/IPFSImage/IPFSImage'

import './BitcoinWallet.scss'

function mapStateToProps (state, props) {

  return {

  }
}

function mapDispatchToProps (dispatch, props) {
  return {

  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class BitcoinWallet extends PureComponent {
  static propTypes = {
    token: PropTypes.instanceOf(TokenModel),
  }


  render () {
    const { token } = this.props
    console.log('BitcoinWallet: ', Button)


    return (
      <div styleName='wallet-container'>
        <div styleName='settings-container'>
          <div styleName='settings-icon' className='chronobank-icon'>settings</div>
        </div>
        <div styleName='token-container'>
          <div styleName='token-icon'>
            <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
          </div>
        </div>
        <div styleName='content-container'>
          <div styleName='address-title'>
            <h3>Bitcoin Wallet</h3>
            <span styleName='address-address'>
              1Q1pE5vPGEEMqRcVRMbtBK842Y6Pzo6nK9
            </span>
          </div>
          <div styleName='token-amount'>
            <div styleName='crypto-amount'>
              BTC 15.2045
            </div>
            <div styleName='usd-amount'>
              USD 121,600.00
            </div>
          </div>
          <div styleName='actions-container'>
            <div styleName='action'>
              <Button
                disabled={false}
                type='submit'
                label={'SEND'}
              />
            </div>
            <div styleName='action'>
              <Button
                disabled={false}
                type='submit'
                label={'RECEIVE'}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
