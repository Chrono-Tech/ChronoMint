/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsOpen } from 'redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import { makeGetWalletTokensAndBalanceByAddress } from 'redux/wallet/selectors'
import { TOKEN_ICONS } from 'assets'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { integerWithDelimiter } from 'utils/formatter'
import ReceiveTokenModal from 'components/dashboard/ReceiveTokenModal/ReceiveTokenModal'
import TokensCollection from 'models/tokens/TokensCollection'
import MainWalletModel from 'models/wallet/MainWalletModel'
import { getTokenForWalletByBlockchain } from 'redux/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import SendTokens from 'components/dashboard/SendTokens/SendTokens'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'

import './WalletWidgetDetail.scss'
import { prefix } from './lang'

function mapStateToProps (state, ownProps) {
  return {
    walletInfo: makeGetWalletTokensAndBalanceByAddress(ownProps.blockchain)(state),
    token: getTokenForWalletByBlockchain(ownProps.blockchain)(state),
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    send: () => dispatch(modalsOpen({
      component: SendTokens,
      props: {
        isModal: true,
      },
    })),
    receive: (blockchain) => dispatch(modalsOpen({
      component: ReceiveTokenModal,
      props: {
        blockchain,
      },
    })),
    deposit: (props) => dispatch(modalsOpen({ component: DepositTokensModal, props })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletWidgetDetail extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    wallet: PropTypes.instanceOf(MainWalletModel || MultisigWalletModel),
    address: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    tokens: PropTypes.instanceOf(TokensCollection),
    walletInfo: PropTypes.shape({
      address: PropTypes.string,
      balance: PropTypes.number,
      tokens: PropTypes.array,
    }),
    send: PropTypes.func,
    receive: PropTypes.func,
    deposit: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      isShowAll: false,
    }
  }

  handleSend = () => {
    this.props.send()
  }

  handleReceive = () => {
    this.props.receive()
  }

  handleDeposit = () => {
    this.props.deposit()
  }

  handleChangeShowAll = () => {
    this.setState({
      isShowAll: !this.state.isShowAll,
    })
  }

  getTokensList = () => {
    return this.state.isShowAll ? this.props.walletInfo.tokens : this.props.walletInfo.tokens.slice(0, 2)
  }

  getOwnersList = () => {
    const ownersList = this.props.wallet.owners().items()

    if (ownersList.length <= 3) {
      return (
        <div styleName='owners-amount'>
          <div styleName='owners-list'>
            {ownersList.map((owner) => {
              return (
                <div styleName='owner-icon'>
                  <div styleName='owner' className='chronobank-icon' title={owner.address()}>profile</div>
                </div>
              )
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
            return (
              <div styleName='owner-icon'>
                <div styleName='owner' className='chronobank-icon' title={owner.address()}>profile</div>
              </div>
            )
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

    const firstToken = walletInfo.tokens[ 0 ]

    return (
      <div styleName='amount-list-container'>
        <div styleName='amount-list'>
          <span styleName='amount-text'>
            {`${firstToken.symbol} ${firstToken.amount.toFixed(2)}`}, {`+ ${walletInfo.tokens.length - 1} more`}
          </span>
        </div>
        <div styleName='show-all'>
          <span styleName='show-all-a' onTouchTap={this.handleChangeShowAll}>{!this.state.isShowAll ? 'Show All' : 'Show less'}</span>
        </div>
      </div>
    )
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig() && !this.props.wallet.isTimeLocked()
  }

  isMainWallet = () => {
    return this.props.wallet.isMultisig() && this.props.wallet.isTimeLocked()
  }

  isLockedWallet = () => {
    return this.props.wallet.isMultisig() && this.props.wallet.isTimeLocked()
  }

  renderIconForWallet (wallet) {
    let icon = 'wallet'
    if (wallet.isMultisig()) {
      if (wallet.is2FA()) {
        icon = 'security'
      } else {
        icon = 'multisig'
      }
    }
    return (
      <div styleName='additional-icon'>
        <div styleName='security-icon' className='chronobank-icon'>{icon}</div>
      </div>
    )
  }

  render () {
    const { address, token, blockchain, walletInfo, wallet } = this.props

    if (walletInfo.balance === null || walletInfo.tokens.length <= 0 || !wallet) {
      return null
    }
    const tokensList = this.getTokensList() || []

    return (
      <div styleName='header-container' className='WalletWidgetDetail__root'>
        <h1 styleName='header-text'><Translate value={`${prefix}.walletTitle`} title={blockchain} /></h1>
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='token-container'>
              {blockchain === BLOCKCHAIN_ETHEREUM && this.renderIconForWallet(wallet)}
              <div styleName='token-icon'>
                <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[ token.symbol() ]} />
              </div>
            </div>
            <div styleName='content-container'>
              <div styleName='address-title'>
                <h3>{this.getWalletName()}</h3>
                <span styleName='address-address'>{address}</span>
              </div>
              <div styleName='token-amount'>
                <div styleName='crypto-amount'>
                  {tokensList.length === 1
                    ? (
                      <div>
                        <div>{tokensList[ 0 ].symbol} {integerWithDelimiter(tokensList[ 0 ].amount.toFixed(2), true)}</div>
                        <div styleName='amountSubTitle'>USD {integerWithDelimiter(tokensList[ 0 ].amountPrice.toFixed(2), true)}</div>
                      </div>
                    )
                    : (
                      <div>
                        <div>USD {integerWithDelimiter(walletInfo.balance.toFixed(2), true)}</div>
                        <div styleName='tokensSubTitle'><Translate value={`${prefix}.tokensTitle`} count={tokensList.length} /></div>
                      </div>
                    )}
                </div>
              </div>

              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.sendButton`} />}
                    onTouchTap={this.handleSend}
                  />
                </div>
                <div styleName='action'>
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.receiveButton`} />}
                    onTouchTap={this.handleReceive}
                  />
                </div>
                {blockchain === BLOCKCHAIN_ETHEREUM && (
                  <div styleName='action'>
                    <Button
                      disabled={false}
                      flat
                      styleName='depositTokensButton'
                      type='submit'
                      label={<Translate value={`${prefix}.depositButton`} />}
                      onTouchTap={this.handleDeposit}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
