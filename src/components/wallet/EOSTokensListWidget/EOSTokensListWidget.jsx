/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { EOSTokensCountBalanceAndPriceSelector } from '@chronobank/core/redux/eos/selectors/balances'
import { getTokens } from '@chronobank/core/redux/tokens/selectors'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import { TOKEN_ICONS } from 'assets'
import { Translate } from 'react-redux-i18n'
import { prefix } from '../TokensListWidget/lang' // Used lang file from original component
import './EOSTokensListWidget.scss'

function makeMapStateToProps (state, props) {
  const { walletId } = props
  const getTokensBalances = EOSTokensCountBalanceAndPriceSelector(walletId)
  return (ownState) => {
    return {
      tokensBalances: getTokensBalances(ownState),
      tokens: getTokens(ownState),
    }
  }
}

@connect(makeMapStateToProps)
export default class EOSTokensListWidget extends PureComponent {
  static propTypes = {
    tokensBalances: PropTypes.arrayOf(PropTypes.shape({
      symbol: PropTypes.string,
      value: PropTypes.number,
    })),
    walletId: PropTypes.string,
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
    let tokens = this.props.tokensBalances.sort((a, b) => {
      if (a[sortBy] > b[sortBy]) {
        return 1
      }
      if (a[sortBy] < b[sortBy]) {
        return -1
      }
      return 0
    })

    if (!direction) {
      tokens = tokens.reverse()
    }
    return this.state.isShowAll ? tokens : tokens.slice(0, 2)
  }

  setSort = (sortBy) => () => {
    this.setState((prevState) => ({
      sortBy, direction: sortBy === prevState.sortBy ? !prevState.direction : true,
    }))
  }

  renderDirection (sortBy) {
    if (sortBy === this.state.sortBy) {
      return <i className='chronobank-icon'>{this.state.direction ? 'up' : 'down'}</i>
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
              <div styleName='tokens-list-table-cell-sort-token' onClick={this.setSort('symbol')}>
                <Translate value={`${prefix}.token`} />&nbsp;
                {this.renderDirection('symbol')}
              </div>
              <div styleName='tokens-list-table-cell-sort-amount' onClick={this.setSort('value')}>
                <Translate value={`${prefix}.amount`} />&nbsp;
                {this.renderDirection('value')}
              </div>
              <div styleName='tokens-list-table-cell-sort-usd' onClick={this.setSort('valueUsd')}>
                <Translate value={`${prefix}.fiat`} />&nbsp;
                {this.renderDirection('valueUsd')}
              </div>
            </div>
            {this.getTokensList().length > 0 && this.getTokensList().map((balanceInfo) => {

              return (
                <div styleName='tokens-list-table-tr' key={balanceInfo.symbol}>
                  <div styleName='tokens-list-table-cell-icon'>
                    <IPFSImage styleName='table-image' fallback={TOKEN_ICONS[balanceInfo.symbol] || TOKEN_ICONS.DEFAULT} />
                    {balanceInfo.symbol}
                  </div>
                  <div styleName='tokens-list-table-cell-amount'>
                    {integerWithDelimiter(balanceInfo.value, true, null)}
                  </div>
                  <div styleName='tokens-list-table-cell-usd'>
                    {integerWithDelimiter(balanceInfo.valueUsd.toFixed(2), true)}
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
              onClick={this.handleChangeShowAll}
            />
          )}
        </div>
      </div>
    )
  }
}
