import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import classNames from 'classnames'
import TokenModel from 'models/tokens/TokenModel'
import TokensCollection from 'models/tokens/TokensCollection'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { TOKEN_ICONS } from 'assets'
import { DepositTokens, Points, Button, SendTokens, IPFSImage, TransactionsTable, WalletChanger, WalletPendingTransfers } from 'components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_WALLET } from 'redux/wallet/actions'

import './WalletsContent.scss'

function mapStateToProps (state) {

  return {
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {

  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletsContent extends Component {
  static propTypes = {
    tokens: PropTypes.instanceOf(TokensCollection),
  }


  render () {

    const token = this.props.tokens.item('BTC')
    const ETHToken = this.props.tokens.item('ETH')

    return (<div styleName='root'>

      <div styleName='header-container'>
        <h1 styleName='header-text'>Bitcoin Wallets</h1>
      </div>

      <div styleName='wallet-container'>
        <div styleName='settings-container'>
          <div styleName='settings-icon' className='chronobank-icon'>deposit</div>
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

      <div styleName='header-container'>
        <h1 styleName='header-text'>Ethereum Wallets</h1>
      </div>

      <div styleName='wallet-container'>
        <div styleName='token-container'>
          <div styleName='token-icon'>
            <IPFSImage styleName='image' multihash={ETHToken.icon()} fallback={TOKEN_ICONS[ETHToken.symbol()]} />
          </div>
        </div>
        <div styleName='content-container'>
          <div styleName='address-title'>
            <h3>My Wallet</h3>
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

    </div>)
  }
}
