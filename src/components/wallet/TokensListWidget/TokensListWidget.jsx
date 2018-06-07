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

import { prefix } from './lang'
import './TokensListWidget.scss'

function mapStateToProps (state, ownProps) {
  return {
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class TokensListWidget extends PureComponent {
  static propTypes = {
    tokens: PropTypes.instanceOf(TokensCollection),
    tokensList: PropTypes.arrayOf(PropTypes.shape({
      amount: PropTypes.number,
      amountPrice: PropTypes.number,
      symbol: PropTypes.string,
    })),
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
    const tokens = this.props.tokensList.sort((a, b) => {
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
    const { tokensList } = this.props
    return (
      <div styleName='root' className='TokensListWidget__root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} count={tokensList.length} />
        </div>

        <div styleName='tokens-list'>
          <div styleName='tokens-list-table'>
            <div styleName='tokens-list-table-tr'>
              <div styleName='tokens-list-table-cell-sort-token' onTouchTap={this.setSort('symbol')}>
                <Translate value={`${prefix}.token`} />&nbsp;
                {this.renderDirection('symbol')}
              </div>
              <div styleName='tokens-list-table-cell-sort-amount' onTouchTap={this.setSort('amount')}>
                <Translate value={`${prefix}.amount`} />&nbsp;
                {this.renderDirection('amount')}
              </div>
              <div styleName='tokens-list-table-cell-sort-usd' onTouchTap={this.setSort('amountPrice')}>
                <Translate value={`${prefix}.fiat`} />&nbsp;
                {this.renderDirection('amountPrice')}
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
                    {integerWithDelimiter(tokenMap.amount, true, null)}
                  </div>
                  <div styleName='tokens-list-table-cell-usd'>
                    {integerWithDelimiter(tokenMap.amountPrice.toFixed(2), true)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div styleName='more'>
          {tokensList.length > 2 && (
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
