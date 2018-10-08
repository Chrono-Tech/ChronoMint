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
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import TokenPrice from 'components/common/TokenPrice/TokenPrice'
import { walletTokensAmountSelector } from '@chronobank/core/redux/wallets/selectors/balances'
import { getMainSymbolForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import Amount from '@chronobank/core/models/Amount'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import './WalletWidget.scss'
import { prefix } from './lang'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  let getAmount = walletTokensAmountSelector(wallet.id)
  const mapStateToProps = (ownState) => {
    const { selectedCurrency } = getMarket(state)
    return {
      mainSymbol: getMainSymbolForBlockchain(wallet.blockchain),
      selectedCurrency,
      amount: getAmount(ownState),
      tokens: ownState.get(DUCK_TOKENS),
    }
  }
  return mapStateToProps
}

@connect(makeMapStateToProps)
export default class WalletTokensList extends PureComponent {
  static propTypes = {
    mainSymbol: PropTypes.string,
    selectedCurrency: PropTypes.string,
    tokens: PropTypes.instanceOf(TokensCollection),
    amount: PropTypes.arrayOf(PropTypes.shape({
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
    const { isShowAll } = this.state

    this.setState({
      isShowAll: !isShowAll,
    })
  }

  getTokensList = () => {
    const tokens = this.props.amount.sort(({ amount: a }, { amount: b }) => (a > b) - (a < b))
    return this.state.isShowAll ? tokens : tokens.slice(0, 2)
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig && !this.props.wallet.isTimeLocked && !this.props.wallet.is2FA
  }

  render () {
    const { amount, mainSymbol } = this.props

    return (
      <div>
        {amount.length >= 3 && (
          <div styleName='amount-list-container'>
            <div styleName='amount-list'>
              <span styleName='amount-text'><Translate value={`${prefix}.tokensTitle`} count={amount.length} /></span>
            </div>
            <div styleName='show-all'>
              <span styleName='show-all-a' onClick={this.handleChangeShowAll}>{!this.state.isShowAll ? 'Show All' : 'Show less'}</span>
            </div>
          </div>
        )}
        {this.getTokensList().length > 1 || (this.getTokensList()[0] && this.getTokensList()[0].symbol !== mainSymbol) ? (
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
        ) : null}

        {this.isMySharedWallet() && this.getTokensList().length <= 0 && (<div styleName='separator' />)}
      </div>
    )
  }
}
