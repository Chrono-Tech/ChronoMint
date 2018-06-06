/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { TOKEN_ICONS } from 'assets'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { integerWithDelimiter } from 'utils/formatter'
import TokensCollection from 'models/tokens/TokensCollection'
import { Button } from 'components'
import { mainWalletTokenBalanceWithPriceSelector } from 'redux/mainWallet/selectors'
import { multisigWalletTokenBalanceWithPriceSelector } from 'redux/multisigWallet/selectors'

import { prefix } from './lang'
import './TokensListWidget.scss'

function makeMapStateToProps (state, props) {
  const { wallet } = props
  let getAmount
  if (wallet.isMain) {
    getAmount = mainWalletTokenBalanceWithPriceSelector(wallet.blockchain)
  } else {
    getAmount = multisigWalletTokenBalanceWithPriceSelector(wallet.address)
  }
  const mapStateToProps = (ownState) => {
    return {
      tokensBalances: getAmount(ownState),
      tokens: ownState.get(DUCK_TOKENS),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class TokensListWidget extends PureComponent {
  static propTypes = {
    tokens: PropTypes.instanceOf(TokensCollection),
    tokensBalances: PropTypes.arrayOf(PropTypes.shape({
      symbol: PropTypes.string,
      value: PropTypes.number,
    })),
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
  }

  constructor (props) {
    super(props)

    this.state = {
      isShowAll: false,
      sortBy: 'symbol',
      direction: true,
    }
  }

  handleChangeShowAll = () => {
    this.setState({
      isShowAll: !this.state.isShowAll,
    })
  }

  getTokensList = () => {
    const { sortBy, direction } = this.state
    const tokens = this.props.tokensBalances.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return direction
      }
      if (a[sortBy] > b[sortBy]) {
        return !direction
      }
      return 0
    })
    return this.state.isShowAll ? tokens : tokens.slice(0, 2)
  }

  setSort = (sortBy) => () => {
    this.setState((prevState) => ({
      sortBy, direction: sortBy === prevState.sortBy ? !prevState.direction : true,
    }))
  }

  renderDirection (sortBy) {
    if (sortBy === this.state.sortBy) {
      return <i className='chronobank-icon'>{this.state.direction ? 'down' : 'up'}</i>
    }
    return null
  }

  render () {
    const { tokensBalances } = this.props

    if (tokensBalances.length < 2) {
      return null
    }

    return (
      <div styleName='root' className='TokensListWidget__root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} count={tokensBalances.length} />
        </div>

        <div styleName='tokens-list'>
          <div styleName='tokens-list-table'>
            <div styleName='tokens-list-table-tr'>
              <div styleName='tokens-list-table-cell-sort-token' onTouchTap={this.setSort('symbol')}>
                <Translate value={`${prefix}.token`} />&nbsp;
                {this.renderDirection('symbol')}
              </div>
              <div styleName='tokens-list-table-cell-sort-amount' onTouchTap={this.setSort('value')}>
                <Translate value={`${prefix}.amount`} />&nbsp;
                {this.renderDirection('value')}
              </div>
              <div styleName='tokens-list-table-cell-sort-usd' onTouchTap={this.setSort('valueUsd')}>
                <Translate value={`${prefix}.fiat`} />&nbsp;
                {this.renderDirection('valueUsd')}
              </div>
            </div>
            {this.getTokensList().length && this.getTokensList().map((tokenMap) => {
              const token = this.props.tokens.item(tokenMap.symbol)
              return (
                <div styleName='tokens-list-table-tr' key={token.id()}>
                  <div styleName='tokens-list-table-cell-icon'>
                    <IPFSImage styleName='table-image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()] || TOKEN_ICONS.DEFAULT} />
                    {tokenMap.symbol}
                  </div>
                  <div styleName='tokens-list-table-cell-amount'>
                    {integerWithDelimiter(tokenMap.value, true, null)}
                  </div>
                  <div styleName='tokens-list-table-cell-usd'>
                    {integerWithDelimiter(tokenMap.valueUsd.toFixed(2), true)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div styleName='more'>
          {tokensBalances.length > 2 && (
            <Button
              flat
              label={<Translate value={`${prefix}.${this.state.isShowAll ? 'less' : 'more'}`} />}
              onTouchTap={this.handleChangeShowAll}
            />
          )}
        </div>
      </div>
    )
  }
}
