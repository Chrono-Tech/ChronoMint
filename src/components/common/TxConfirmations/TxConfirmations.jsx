/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import TxModel from 'models/TxModel'
import TokensCollection from 'models/tokens/TokensCollection'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import './TxConfirmations.scss'

function mapStateToProps (state) {
  return {
    tokens: state.get(DUCK_TOKENS),
  }
}

@connect(mapStateToProps)
export default class TxConfirmations extends PureComponent {
  static propTypes = {
    transaction: PropTypes.instanceOf(TxModel).isRequired,
    tokens: PropTypes.instanceOf(TokensCollection),
  }

  render () {
    const { transaction, tokens } = this.props
    const { blockNumber: latestBlock } = tokens.latestBlocksForSymbol(transaction.symbol())
    return (
      <div styleName='root'>
        {latestBlock - transaction.blockNumber()}
      </div>
    )
  }
}
