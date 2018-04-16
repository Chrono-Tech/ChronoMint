/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import React, { PureComponent } from 'react'
import Amount from 'models/Amount'
import { modalsOpen } from 'redux/modals/actions'
import TokenValue from '../../common/TokenValue/TokenValue'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_TOKENS } from "redux/tokens/actions";
import { makeGetWalletTokensAndBalanceByAddress } from 'redux/wallet/selectors'
import { TOKEN_ICONS } from 'assets'
import Button from '../../common/ui/Button/Button'
import IPFSImage from '../../common/IPFSImage/IPFSImage'
import SendTokens from "../../dashboard/SendTokens/SendTokens";

import './BitcoinWallet.scss'

const mapStateToProps = (state, props) => {
  return {
    tokens: state.get(DUCK_TOKENS),
    walletInfo: makeGetWalletTokensAndBalanceByAddress(props.blockchainTitle)(state),
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    modalOpen: (componentObject) => {
      dispatch(modalsOpen(componentObject))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class BitcoinWallet extends PureComponent {
  static propTypes = {
    blockchainTitle: PropTypes.string,
    walletInfo: PropTypes.object,
    tokenTitle: PropTypes.string,
    address: PropTypes.string,
  }

  getAmount = () => {
    const amountObject = this.getWalletObject()
    return amountObject.amount ? amountObject.amount : '0.00'
  }

  getWalletObject = () => {
    return this.props.walletInfo.tokens.find(a => a.symbol === this.props.tokenTitle)
  }

  render () {

    const token = this.props.tokens.item(this.props.tokenTitle)
    const { walletInfo, address, tokenTitle } =  this.props
    const amountObject = this.getWalletObject()

    console.log('BitcoinWallet : ', this.props )

    if (!amountObject) {
      console.warn('Can not find token ' + tokenTitle)
      return null
    }

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
              {address}
            </span>
          </div>
          <div styleName='token-amount'>
            <div styleName='crypto-amount'>
              {`${tokenTitle} ${this.getAmount()}`}
            </div>
            <div styleName='usd-amount'>
              ≈USD <TokenValue renderOnlyPrice onlyPriceValue value={new Amount(this.getAmount(), tokenTitle)} />
            </div>
          </div>
          <div styleName='actions-container'>
            <div styleName='action'>
              <Button
                disabled={false}
                type='submit'
                label={'SEND'}
                onClick={(e) => {
                  this.props.modalOpen({component: SendTokens, props: {isModal: true}})
                }}
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
