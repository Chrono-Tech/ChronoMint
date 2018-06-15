/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { TOKEN_ICONS } from 'assets'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { integerWithDelimiter } from 'utils/formatter'
import { getMarket } from 'redux/market/selectors'
import { mainWalletTokenBalanceSelector } from 'redux/mainWallet/selectors'
import { multisigWalletTokenBalanceSelector } from 'redux/multisigWallet/selectors'
import TokenPrice from 'components/common/TokenPrice/TokenPrice'
import Amount from 'models/Amount'
import TokensCollection from 'models/tokens/TokensCollection'
import { PTWallet } from 'redux/wallet/types'
import './WalletWidget.scss'
import { prefix } from './lang'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  let getAmount
  if (wallet.isMain) {
    getAmount = mainWalletTokenBalanceSelector(wallet.blockchain)
  } else {
    getAmount = multisigWalletTokenBalanceSelector(wallet.address)
  }
  const mapStateToProps = (ownState) => {
    const { selectedCurrency } = getMarket(state)
    return {
      selectedCurrency,
      tokensBalances: getAmount(ownState),
      tokens: ownState.get(DUCK_TOKENS),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletTokensList extends PureComponent {
  static propTypes = {
    selectedCurrency: PropTypes.string,
    tokens: PropTypes.instanceOf(TokensCollection),
    tokensBalances: PropTypes.arrayOf(PropTypes.shape({
      symbol: PropTypes.string,
      value: PropTypes.number,
    })),
    wallet: PTWallet,
  }

  constructor (props) {
    super(props)

    this.state = {
      isShowAll: false,
    }
  }

  handleChangeShowAll = () => {
    this.setState({
      isShowAll: !this.state.isShowAll,
    })
  }

  getTokensList = () => {
    const tokens = this.props.tokensBalances.sort(({ amount: a }, { amount: b }) => (a > b) - (a < b))
    return this.state.isShowAll ? tokens : tokens.slice(0, 2)
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig && !this.props.wallet.isTimeLocked && !this.props.wallet.is2FA
  }

  render () {
    const { tokensBalances } = this.props

    return (
      <div>
        {tokensBalances.length >= 3 &&
        <div styleName='amount-list-container'>
          <div styleName='amount-list'>
            <span styleName='amount-text'><Translate value={`${prefix}.tokensTitle`} count={tokensBalances.length} /></span>
          </div>
          <div styleName='show-all'>
            <span styleName='show-all-a' onClick={this.handleChangeShowAll}>{!this.state.isShowAll ? 'Show All' : 'Show less'}</span>
          </div>
        </div>}

        {this.getTokensList().length > 1 && (
          <div styleName='tokens-list'>
            <div styleName='tokens-list-table'>
              {this.getTokensList()
                .map((tokenBalance) => {
                  const token = this.props.tokens.item(tokenBalance.symbol)

                  if (!token.isFetched()) {
                    return null
                  }
                  return (
                    <div styleName='tokens-list-table-tr' key={token.id()}>
                      <div styleName='tokens-list-table-cell-icon'>
                        <IPFSImage styleName='table-image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()] || TOKEN_ICONS.DEFAULT} />
                      </div>
                      <div styleName='tokens-list-table-cell-amount'>
                        {token.symbol()} {integerWithDelimiter(tokenBalance.value, true, null)}
                      </div>
                      <div styleName='tokens-list-table-cell-usd'>
                        {this.props.selectedCurrency} <TokenPrice value={new Amount(tokenBalance.value, tokenBalance.symbol)} />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {this.isMySharedWallet() && this.getTokensList().length <= 0 && (<div styleName='separator' />)}
      </div>
    )
  }
}
