/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import { Link } from 'react-router'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { openSendForm, selectWallet } from 'redux/wallet/actions'
import { modalsOpen } from 'redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import { ETH } from 'redux/mainWallet/actions'
import { TOKEN_ICONS } from 'assets'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import ReceiveTokenModal from 'components/dashboard/ReceiveTokenModal/ReceiveTokenModal'
import TokensCollection from 'models/tokens/TokensCollection'
import { getMainSymbolForBlockchain, getTokens } from 'redux/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import SendTokens from 'components/dashboard/SendTokens/SendTokens'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'
import './WalletWidget.scss'
import { prefix } from './lang'
import Moment from '../../common/Moment'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'
import WalletSettingsForm from '../AddWalletWidget/WalletSettingsForm/WalletSettingsForm'
import { getWalletInfo } from '../WalletWidgetMini/selectors'
import WalletMainCoinBalance from './WalletMainCoinBalance'
import WalletTokensList from './WalletTokensList'

function makeMapStateToProps (state, ownProps) {
  const getWallet = getWalletInfo(ownProps.blockchain, ownProps.address)
  const mapStateToProps = (ownState) => {
    const tokens = getTokens(ownState)
    return {
      wallet: getWallet(ownState),
      token: tokens.item(getMainSymbolForBlockchain(ownProps.blockchain)),
      tokens: state.get(DUCK_TOKENS),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    send: (tokenId, wallet) => {
      dispatch(openSendForm({
        wallet,
        isModal: true,
        token: tokenId,
        blockchain: wallet.blockchain,
        address: wallet.address,
      }, SendTokens))
    },
    receive: (blockchain) => dispatch(modalsOpen({
      component: ReceiveTokenModal,
      props: {
        blockchain,
      },
    })),
    deposit: (props) => dispatch(modalsOpen({ component: DepositTokensModal, props })),
    selectWallet: (blockchain, address) => dispatch(selectWallet(blockchain, address)),
    setWalletName: (wallet, blockchain, address) => dispatch(modalsOpen({
      component: WalletSettingsForm,
      props: {
        wallet,
        blockchain,
        address,
      },
    })),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class WalletWidget extends PureComponent {
  static propTypes = {
    setWalletName: PropTypes.func,
    blockchain: PropTypes.string,
    wallet: PropTypes.shape({
      address: PropTypes.string,
      blockchain: PropTypes.string,
      name: PropTypes.string,
      requiredSignatures: PropTypes.number,
      pendingCount: PropTypes.number,
      isMultisig: PropTypes.bool,
      isTimeLocked: PropTypes.bool,
      is2FA: PropTypes.bool,
      isDerived: PropTypes.bool,
      owners: PropTypes.arrayOf(PropTypes.string),
      customTokens: PropTypes.arrayOf(),
    }),
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
    selectWallet: PropTypes.func,
    showGroupTitle: PropTypes.bool,
  }

  constructor (props) {
    super(props)

    this.state = {
      isShowAll: false,
      isSettingsOpen: false,
    }
  }

  handleSend = (wallet) => () => {
    this.props.send(this.props.token.id(), wallet)
  }

  handleReceive = () => {
    this.props.receive(this.props.blockchain)
  }

  handleDeposit = () => {
    this.props.deposit()
  }

  handleChangeShowAll = () => {
    this.setState({
      isShowAll: !this.state.isShowAll,
    })
  }

  handleSelectWallet = () => {
    const { address, blockchain } = this.props
    this.props.selectWallet(blockchain, address)
  }

  handleOpenSettings = () => {
    this.props.setWalletName(this.props.wallet, this.props.blockchain, this.props.address)
  }

  getOwnersList = () => {
    const ownersList = this.props.wallet.owners

    if (ownersList.length <= 3) {
      return (
        <div styleName='owners-amount'>
          <div styleName='owners-list'>
            {ownersList.map((ownerAddress) => {
              return (
                <div styleName='owner-icon' key={ownerAddress}>
                  <div styleName='owner' className='chronobank-icon' title={ownerAddress}>profile</div>
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
    const { wallet } = this.props
    const name = wallet.name
    if (name) {
      return name
    }

    let key = null
    if (this.isMy2FAWallet()) {
      key = 'twoFAWallet'
    } else if (this.isMySharedWallet()) {
      key = 'sharedWallet'
    } else if (this.isLockedWallet()) {
      key = 'lockedWallet'
    } else if (wallet.isDerived) {
      if (wallet.customTokens) {
        key = 'customWallet'
      } else {
        key = 'additionalStandardWallet'
      }
    } else {
      key = 'standardWallet'
    }

    return <Translate value={`${prefix}.${key}`} />
  }

  getTokensList = () => {
    const tokens = this.props.walletInfo.tokens.sort((a, b) => {
      if (a.amount < b.amount) {
        return 1
      }
      if (a.amount > b.amount) {
        return -1
      }
      return 0
    })
    return this.state.isShowAll ? tokens : tokens.slice(0, 2)
  }

  getTokenAmountList = () => {
    const walletInfo = this.props.walletInfo
    if (this.props.blockchain === BLOCKCHAIN_ETHEREUM) {
      let eth
      walletInfo.tokens.some((token) => {
        if (token.symbol === ETH) {
          eth = token
          return true
        }
      })

      if (eth) {
        return `${eth.symbol} ${eth.amount.toFixed(2)}`
      }
      return null
    }
    let tokenList = walletInfo.tokens

    if (tokenList.length < 3) {
      return null
    }

    if (tokenList.length >= 4) {
      tokenList = tokenList.slice(0, 3)
    }

    return tokenList.map((token) => `${token.symbol} ${token.amount.toFixed(2)}`).join(', ')
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig && !this.props.wallet.isTimeLocked && !this.props.wallet.is2FA
  }

  isMy2FAWallet = () => {
    return this.props.wallet.isMultisig && this.props.wallet.is2FA
  }

  isMainWallet = () => {
    return !this.props.wallet.isMultisig && !this.props.wallet.isTimeLocked
  }

  isLockedWallet = () => {
    return this.props.wallet.isMultisig && this.props.wallet.isTimeLocked
  }

  getWalletObj (wallet) {
    return {
      isMultisig: wallet.isMultisig,
      isTimeLocked: wallet.isTimeLocked,
      is2FA: wallet.is2FA ? wallet.is2FA : false,
      isDerived: wallet.isDerived,
    }
  }

  render () {
    const { address, token, blockchain, wallet, showGroupTitle } = this.props

    if (!token || !token.isFetched()) {
      return null
    }

    return (
      <div styleName='header-container'>
        {showGroupTitle && <h1 styleName='header-text' id={blockchain}><Translate value={`${prefix}.walletTitle`} title={blockchain} /></h1>}
        <div styleName='wallet-list-container'>

          <div styleName='wallet-container'>
            {wallet.pendingCount > 0 && (
              <div styleName='pendings-container'>
                <div styleName='pendings-icon'><Translate value={`${prefix}.pending`} count={wallet.pendingCount} /></div>
              </div>
            )}
            <div styleName='settings-container'>
              <div styleName='settings-icon' className='chronobank-icon' onTouchTap={this.handleOpenSettings}>settings
              </div>
            </div>
            <div styleName='token-container'>
              {blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
              <div styleName='token-icon'>
                <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()]} />
              </div>
            </div>
            <div styleName='content-container'>
              <Link styleName='addressWrapper' href='' to='/wallet' onTouchTap={this.handleSelectWallet}>
                <div styleName='address-title'>
                  <h3>{this.getWalletName()}</h3>
                  <span styleName='address-address'>{address}</span>
                </div>

                <WalletMainCoinBalance wallet={wallet} />
              </Link>

              {this.isMySharedWallet() && this.getOwnersList()}

              <WalletTokensList wallet={wallet} />

              {wallet.isTimeLocked && (
                <div styleName='unlockDateWrapper'>
                  <Translate value={`${prefix}.unlockDate`} /> <Moment data={wallet.releaseTime} format='HH:mm, Do MMMM YYYY' />
                </div>
              )}

              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.sendButton`} />}
                    onTouchTap={this.handleSend(wallet)}
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
                {/*blockchain === BLOCKCHAIN_ETHEREUM && (
                  <div styleName='action'>
                    <Button
                      disabled={false}
                      flat
                      type='submit'
                      label={<Translate value={`${prefix}.depositButton`} />}
                      onTouchTap={this.handleDeposit}
                    />
                  </div>
                )*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
