/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import MultisigWalletModel from "models/wallet/MultisigWalletModel";
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
import { integerWithDelimiter } from 'utils/formatter'

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
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    address: PropTypes.string,
    walletInfo: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      isShowAll: false
    }
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig() && !this.props.wallet.isTimeLocked()
  }

  isLockedWallet = () => {
    return this.props.wallet.isMultisig() && this.props.wallet.isTimeLocked()
  }

  isMainWallet = () => {
    return this.props.wallet.isMultisig() && this.props.wallet.isTimeLocked()
  }

  onChangeShowAll = () => {
    this.setState({
      isShowAll: !this.state.isShowAll
    })
  }

  getTokensList = () => {
    return this.state.isShowAll ? this.props.walletInfo.tokens : this.props.walletInfo.tokens.slice(0, 2)
  }

  getWalletObject = () => {
    return this.props.walletInfo.tokens.find(a => a.symbol === this.props.tokenTitle)
  }

  getOwnersList = () => {
    const ownersList = this.props.wallet.owners().items()

    if (ownersList.length <= 3) {
      return (
        <div styleName='owners-amount'>
          <div styleName='owners-list'>
            {ownersList.map((owner) => {
                return (<div styleName='owner-icon'>
                    <div styleName='owner' className='chronobank-icon' title={owner.address()}>profile</div>
                  </div>)
              })
            }
          </div>
        </div>
      )
    }

    return (
      <div styleName='owners-amount'>
        <div styleName='owners-list'>
          {ownersList.slice(0, 2).map((owner) => {
              return (<div styleName='owner-icon'>
                <div styleName='owner' className='chronobank-icon' title={owner.address()}>profile</div>
              </div>)
            })
          }
          <div styleName='owner-counter'>
            <div styleName='counter'>+{ownersList.length - 2}</div>
          </div>
        </div>
      </div>
    )
  }

  getWalletName = () => {
    if (this.isMySharedWallet()) {
      return 'My Shared Wallet'
    } else if (this.isLockedWallet()) {
      return 'My Locked Wallet'
    }

    return 'My Wallet'
  }

  getAmountList = () => {
    const walletInfo = this.props.walletInfo

    if (walletInfo.tokens.length < 3) {
      return null
    }

    const firstToken = walletInfo.tokens[0]

    return (<div styleName='amount-list-container'>
      <div styleName='amount-list'>
              <span styleName='amount-text'>
                {`${firstToken.symbol} ${firstToken.amount.toFixed(2)}`}, {`+ ${walletInfo.tokens.length - 1} more`}
              </span>
      </div>
      <div styleName='show-all'>
        <a styleName='show-all-a' onClick={this.onChangeShowAll} href='javascript:void(0);'>{ !this.state.isShowAll ? 'Show All' : 'Show less' }</a>
      </div>
    </div>)
  }

  render () {
    const token = this.props.tokens.item('ETH')
    const { address, tokenTitle, walletInfo, wallet } = this.props
    const amountObject = this.getWalletObject()

    console.log('EthereumWallet: ', wallet, wallet.transactions())

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
            <h3>{this.getWalletName()}</h3>
            <span styleName='address-address'>
              { address }
            </span>
          </div>
          <div styleName='token-amount'>
            <div styleName='crypto-amount'>
              USD {integerWithDelimiter(walletInfo.balance.toFixed(2), true)}
            </div>
          </div>

          { this.isMySharedWallet() && this.getOwnersList() }

          { this.getAmountList()}

          <div styleName='tokens-list'>
            <div styleName='tokens-list-table'>
              {this.getTokensList().length && this.getTokensList().map((tokenMap) => {
                const token = this.props.tokens.item(tokenMap.symbol)
                console.log('walletInfo.tokens: ', token, tokenMap)

                return (
                  <div styleName='tokens-list-table-tr'>
                    <div styleName='tokens-list-table-cell-icon'>
                      <IPFSImage styleName='table-image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
                    </div>
                    <div styleName='tokens-list-table-cell-amount'>
                      {tokenMap.symbol}  {integerWithDelimiter(tokenMap.amount, true, null)}
                    </div>
                    <div styleName='tokens-list-table-cell-usd'>
                      USD {integerWithDelimiter(tokenMap.amountPrice.toFixed(2), true)}
                    </div>
                  </div>
                )
              })}

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
