/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import classnames from 'classnames'
import Button from 'components/common/ui/Button/Button'
import TxConfirmations from 'components/common/TxConfirmations/TxConfirmations'
import { selectCurrentNetworkBlockchains } from '@chronobank/nodes/redux/selectors'
import Moment from 'components/common/Moment'
import TokenValue from 'components/common/TokenValue/TokenValue'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_I18N } from 'redux/i18n/constants'
import Preloader from 'components/common/Preloader/Preloader'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import './TransactionsTable.scss'
import { prefix } from './lang'

const mapStateToProps = (state) => {
  const currentNetworkBlockchainsInfo = selectCurrentNetworkBlockchains(state)

  return {
    currentNetworkBlockchainsInfo,
    account: state.get(DUCK_SESSION).account,
    locale: state.get(DUCK_I18N).locale,
    tokens: state.get(DUCK_TOKENS),
  }
}

@connect(mapStateToProps)
export default class TransactionsTable extends PureComponent {
  static propTypes = {
    walletAddress: PropTypes.string,
    transactions: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    onGetTransactions: PropTypes.func.isRequired,
    tokens: PropTypes.instanceOf(TokensCollection),
    account: PropTypes.string,
  }

  handleLoadMore = () => {
    this.props.onGetTransactions()
  }

  renderRow ({ trx }) {
    const account = this.props.walletAddress || this.props.account
    const token: TokenModel = this.props.tokens.item(trx.symbol())
    const blockExplorerUrl = this.props(token.blockchain())
    const isFrom = trx.from().split(',').some((from) => from === account)

    const info = (
      <div styleName='info'>
        <div styleName='title'><Translate value={`${prefix}.${isFrom ? 'sending' : 'receiving'}`} /></div>
        <div styleName='address'>{isFrom ? trx.to() : trx.from()}</div>
      </div>
    )

    return (
      <div styleName='row' key={trx.id()}>
        <div styleName='confirmations'><TxConfirmations transaction={trx} /></div>

        {
          blockExplorerUrl
            ? <a styleName='link' href={new URL(trx.txHash(), blockExplorerUrl)} target='_blank' rel='noopener noreferrer'>{info}</a>
          : info
        }

        <div styleName='valuesWrapper'>
          <div styleName={classnames('value', { 'receiving': !isFrom, 'sending': isFrom })}>
            <TokenValue value={trx.value()} noRenderPrice />
          </div>
          <div styleName='confirmationsText'><TxConfirmations transaction={trx} textMode /></div>
        </div>
      </div>
    )
  }

  render () {
    const { transactions, locale } = this.props
    const size = transactions.length
    const endOfList = false //transactions.endOfList() //TODO
    const isFetching = false //transactions.isFetching() //TODO
    const data = buildTableData(transactions, locale)

    return (
      <div styleName='root' className='TransactionsTable__root'>
        <div styleName='content'>
          {!size && endOfList
            ? (
              <div styleName='no-transactions-section'>
                <div styleName='section-header'>
                  <h5 styleName='no-transactions'><Translate value={`${prefix}.noTransactionsFound`} /></h5>
                </div>
              </div>
            )
            : ''
          }
          {!size && !endOfList
            ? (
              <div styleName='no-transactions-section'>
                <div styleName='section-header'>
                  <div styleName='txs-loading'><Preloader size={24} thickness={1.5} /></div>
                </div>
              </div>
            )
            : ''
          }
          {data.map((group) => (
            <div styleName='section' key={group.dateBy}>
              <div styleName='section-header'>{group.dateTitle}</div>
              <div styleName='table'>
                <div styleName='table-body'>
                  {group.transactions.map((item, index) => this.renderRow(item, index))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {endOfList || !size
          ? null
          : (
            <div styleName='footer'>
              <Button
                flat
                label={isFetching ? <Preloader
                  style={{ verticalAlign: 'middle', marginTop: -2 }}
                  size={24}
                  thickness={1.5}
                /> : 'Load More'}
                disabled={isFetching}
                onClick={this.handleLoadMore}
              />
            </div>
          )}
      </div>
    )
  }
}

function buildTableData (transactions, locale) {
  moment.locale(locale)
  const groups = transactions
    .filter((tx) => tx.value().gt(0))
    .reduce((data, trx) => {
      const groupBy = trx.date('YYYY-MM-DD')
      data[groupBy] = data[groupBy] || {
        dateBy: trx.date('YYYY-MM-DD'),
        dateTitle: <Moment date={trx.date('YYYY-MM-DD')} format='DD MMMM YYYY' />,
        transactions: [],
      }
      data[groupBy].transactions.push({
        trx,
        timeBy: trx.date('HH:mm:ss'),
        timeTitle: trx.date('HH:mm'),
      })
      return data
    }, {})

  return Object.values(groups)
    .sort((a, b) => a.dateBy > b.dateBy ? -1 : a.dateBy < b.dateBy)
    .map((group) => ({
      ...group,
      transactions: group.transactions.sort((a, b) => a.timeBy > b.timeBy ? -1 : a.timeBy < b.timeBy),
    }))
}
