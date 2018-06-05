/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { integerWithDelimiter } from 'utils/formatter'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { ETH } from 'redux/mainWallet/actions'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { balanceSelector, mainWalletBalanceSelector } from 'redux/mainWallet/selectors'
import { multisigBalanceSelector, multisigWalletBalanceSelector } from 'redux/multisigWallet/selectors'
import { getMainSymbolForBlockchain } from 'redux/tokens/selectors'
import './WalletWidget.scss'
import { prefix } from './lang'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  const mainSymbol = getMainSymbolForBlockchain(wallet.blockchain)
  let getAmount
  let getBalance
  if (wallet.isMain) {
    getAmount = balanceSelector(wallet.blockchain, mainSymbol)
    getBalance = mainWalletBalanceSelector(wallet.blockchain, mainSymbol)
  } else {
    getAmount = multisigBalanceSelector(wallet.address, mainSymbol)
    getBalance = multisigWalletBalanceSelector(wallet.address, mainSymbol)
  }
  const mapStateToProps = (ownState) => {
    return {
      mainSymbol,
      amountUsd: getAmount(ownState),
      balance: getBalance(ownState),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class WalletMainCoinBalance extends PureComponent {
  static propTypes = {
    mainSymbol: PropTypes.string,
    amountUsd: PropTypes.number,
    balance: PropTypes.number,
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
      customTokens: PropTypes.arrayOf(),
    }),
  }

  constructor (props) {
    super(props)

    this.state = {
      isShowAll: false,
      isSettingsOpen: false,
    }
  }

  handleSend = (wallet) => () => {
    this.props.send(this.props.token.id(), this.props.blockchain, this.props.address, wallet)
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
    const ownersList = this.props.wallet.owners().items()

    if (ownersList.length <= 3) {
      return (
        <div styleName='owners-amount'>
          <div styleName='owners-list'>
            {ownersList.map((owner) => {
              return (
                <div styleName='owner-icon' key={owner.address()}>
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
    const { mainSymbol, amountUsd, balance } = this.props

    return (
      <div styleName='token-amount'>
        <div styleName='crypto-amount'>
          {mainSymbol} {integerWithDelimiter(balance, true, null)}
        </div>
        <div styleName='usd-amount'>
          USD {integerWithDelimiter(amountUsd.toFixed(2), true)}
        </div>
      </div>
    )
  }
}
