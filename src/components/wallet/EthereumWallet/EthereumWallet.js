/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import TokenValue from '../../common/TokenValue/TokenValue'
import Amount from 'models/Amount'
import { makeGetWalletTokensAndBalanceByAddress } from 'redux/wallet/selectors'
import { TOKEN_ICONS } from 'assets'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import Button from '../../common/ui/Button/Button'
import IPFSImage from '../../common/IPFSImage/IPFSImage'

import './EthereumWallet.scss'

function mapStateToProps (state, props) {

  return {
    tokens: state.get(DUCK_TOKENS),
    walletInfo: makeGetWalletTokensAndBalanceByAddress(props.blockchainTitle)(state),
  }
}

function mapDispatchToProps (dispatch, props) {
  return {

  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EthereumWallet extends PureComponent {
  static propTypes = {
    token: PropTypes.instanceOf(TokenModel),
    tokens: PropTypes.object,
    tokenTitle: PropTypes.string,
    address: PropTypes.string,
    walletInfo: PropTypes.object,
  }

  getWalletObject = () => {
    return this.props.walletInfo.tokens.find(a => a.symbol === this.props.tokenTitle)
  }

  render () {
    const token = this.props.tokens.item('ETH')
    const { address, tokenTitle, walletInfo } = this.props
    const amountObject = this.getWalletObject()

    console.log('amountObject: ', walletInfo, this.props)

    if (!amountObject) {
      return null
    }

    return (

      <div styleName='wallet-container'>
        <div styleName='settings-container'>
          <div styleName='settings-icon' className='chronobank-icon'>settings</div>
        </div>
        <div styleName='token-container'>
          <div styleName='additional-icon'>
            <div styleName='security-icon' className='chronobank-icon'>security</div>
          </div>
          <div styleName='token-icon'>
            <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
          </div>
        </div>
        <div styleName='content-container'>
          <div styleName='address-title'>
            <h3>My Wallet</h3>
            <span styleName='address-address'>
              { address }
            </span>
          </div>
          <div styleName='token-amount'>
            <div styleName='crypto-amount'>
              USD <TokenValue renderOnlyPrice onlyPriceValue value={new Amount(walletInfo.amountPrice, tokenTitle)} />
            </div>
          </div>
          <div styleName='tokens-list'>
            <div styleName='tokens-list-table'>
              <div styleName='tokens-list-table-tr'>
                <div styleName='tokens-list-table-cell-icon'>
                  <IPFSImage styleName='table-image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
                </div>
                <div styleName='tokens-list-table-cell-amount'>
                  ETH 10.00
                </div>
                <div styleName='tokens-list-table-cell-usd'>
                  USD 10,000.00
                </div>
              </div>
              <div styleName='tokens-list-table-tr'>
                <div styleName='tokens-list-table-cell-icon'>
                  <IPFSImage styleName='table-image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
                </div>
                <div styleName='tokens-list-table-cell-amount'>
                  ETH 10.00
                </div>
                <div styleName='tokens-list-table-cell-usd'>
                  USD 10,000.00
                </div>
              </div>
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
            <div styleName='action'>
              <Button
                disabled={false}
                flat
                type='submit'
                label={'DEPOSIT'}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
