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
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import { getMarket } from '@chronobank/core/redux/market/selectors'
import TokenPrice from 'components/common/TokenPrice/TokenPrice'
import Amount from '@chronobank/core/models/Amount'
import { PTWallet } from '@chronobank/core/redux/wallet/types'
import { EOS } from '@chronobank/core/redux/eos/constants'
import { EOSTokensCountBalanceSelector } from '@chronobank/core/redux/eos/selectors/balances'
import './EOSWalletWidget.scss'
import { prefix } from './lang'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  const getAmount = EOSTokensCountBalanceSelector(wallet.id)

  return (ownState) => {
    const { selectedCurrency } = getMarket(state)
    return {
      mainSymbol: EOS,
      selectedCurrency,
      amount: getAmount(ownState),
    }
  }
}

@connect(makeMapStateToProps)
export default class EOSWalletTokensList extends PureComponent {
  static propTypes = {
    mainSymbol: PropTypes.string,
    selectedCurrency: PropTypes.string,
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
    this.setState({
      isShowAll: !this.state.isShowAll,
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
                .map((balance) => {
                  return (
                    <div styleName='tokens-list-table-tr' key={balance.symbol}>
                      <div styleName='tokens-list-table-cell-icon'>
                        <IPFSImage styleName='table-image' fallback={TOKEN_ICONS[balance.symbol] || TOKEN_ICONS.DEFAULT} />
                      </div>
                      <div styleName='tokens-list-table-cell-amount'>
                        {balance.symbol} {integerWithDelimiter(balance.value, true, null)}
                      </div>
                      <div styleName='tokens-list-table-cell-usd'>
                        {this.props.selectedCurrency} <TokenPrice value={new Amount(balance.value, balance.symbol)} isRemoveDecimals={false} />
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
