/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import TxModel from 'models/TxModel'
import TokensCollection from 'models/tokens/TokensCollection'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { TX_CONFIRMATIONS } from 'assets'
import { DUCK_SESSION } from 'redux/session/actions'
import { prefix } from './lang'
import './TxConfirmations.scss'

function mapStateToProps (state) {
  return {
    tokens: state.get(DUCK_TOKENS),
    account: state.get(DUCK_SESSION).account,
  }
}

@connect(mapStateToProps)
export default class TxConfirmations extends PureComponent {
  static propTypes = {
    transaction: PropTypes.instanceOf(TxModel).isRequired,
    tokens: PropTypes.instanceOf(TokensCollection),
    account: PropTypes.string,
    textMode: PropTypes.bool,
  }

  renderConfirmations (confirmations) {
    const { account, transaction } = this.props
    let prefix = null
    let icon = null
    if (account === transaction.to()) {
      prefix = 'r'
    } else {
      prefix = 's'
    }

    if (confirmations <= 4) {
      icon = TX_CONFIRMATIONS[ `${prefix}_${confirmations}` ]
    } else {
      icon = TX_CONFIRMATIONS[ `${prefix}_4` ]
    }

    return <img src={icon} alt='' />
  }

  renderText () {
    const { transaction, tokens, textMode } = this.props
    const { blockNumber: latestBlock } = tokens.latestBlocksForSymbol(transaction.symbol())
    const confirmations = latestBlock - transaction.blockNumber() + 1

    if (textMode) {
      let remaning
      if (confirmations > 0 && confirmations < 4) {
        remaning = 30 * 4 / confirmations
        return <Translate value={`${prefix}.confirmations`} min={Math.ceil(remaning / 60)} confirmations={confirmations} />
      } else {
        return <Translate value={`${prefix}.done`} />
      }
    }

  }

  render () {
    const { transaction, tokens, textMode } = this.props
    const { blockNumber: latestBlock } = tokens.latestBlocksForSymbol(transaction.symbol())
    const confirmations = latestBlock - transaction.blockNumber() + 1

    return (
      <div styleName='root' className='TxConfirmations__root'>
        {
          textMode
            ? this.renderText()
            : this.renderConfirmations(confirmations)
        }
      </div>
    )
  }
}
