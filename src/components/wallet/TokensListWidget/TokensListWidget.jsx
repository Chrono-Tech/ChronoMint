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
    }
  }

  handleChangeShowAll = () => {
    this.setState({
      isShowAll: !this.state.isShowAll,
    })
  }

  getTokensList = () => {
    return this.state.isShowAll ? this.props.tokensList : this.props.tokensList.slice(0, 2)
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
            {this.getTokensList().length && this.getTokensList().map((tokenMap) => {
              const token = this.props.tokens.item(tokenMap.symbol)
              return (
                <div styleName='tokens-list-table-tr' key={token.id()}>
                  <div styleName='tokens-list-table-cell-icon'>
                    <IPFSImage styleName='table-image' multihash={token.icon()} fallback={TOKEN_ICONS[ token.symbol() ] || TOKEN_ICONS.DEFAULT} />
                  </div>
                  <div styleName='tokens-list-table-cell-amount'>
                    {tokenMap.symbol} {integerWithDelimiter(tokenMap.amount, true, null)}
                  </div>
                  <div styleName='tokens-list-table-cell-usd'>
                    USD {integerWithDelimiter(tokenMap.amountPrice.toFixed(2), true)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div styleName='more'>
          <Button
            flat
            label={<Translate value={`${prefix}.${this.state.isShowAll ? 'less' : 'more'}`} />}
            onTouchTap={this.handleChangeShowAll}
          />
        </div>
      </div>
    )
  }
}
