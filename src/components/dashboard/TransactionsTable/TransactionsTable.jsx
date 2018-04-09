/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button } from 'components'
import { getBlockExplorerUrl } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import Moment from 'components/common/Moment/index'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { Paper } from 'material-ui'
import { SHORT_DATE } from 'models/constants'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_I18N } from 'redux/configureStore'
import { getAccountTransactions } from 'redux/mainWallet/actions'
import Preloader from 'components/common/Preloader/Preloader'
import { integerWithDelimiter } from 'utils/formatter'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokensCollection from 'models/tokens/TokensCollection'
import TokenModel from 'models/tokens/TokenModel'
import { getTxs } from 'redux/mainWallet/selectors'
import TransactionsCollection from 'models/wallet/TransactionsCollection'
import './TransactionsTable.scss'

function mapStateToProps (state) {
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  return {
    locale: state.get(DUCK_I18N).locale,
    transactions: getTxs()(state),
    selectedNetworkId,
    selectedProviderId,
    tokens: state.get(DUCK_TOKENS),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getAccountTransactions: () => dispatch(getAccountTransactions()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class TransactionsTable extends PureComponent {
  static propTypes = {
    transactions: PropTypes.instanceOf(TransactionsCollection),
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,
    locale: PropTypes.string,
    getAccountTransactions: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
  }

  handleLoadMore = () => {
    this.props.getAccountTransactions()
  }

  renderRow ({ timeTitle, trx }, index) {
    const token: TokenModel = this.props.tokens.item(trx.symbol())
    const blockExplorerUrl = (txHash) => getBlockExplorerUrl(this.props.selectedNetworkId, this.props.selectedProviderId, txHash, token.blockchain())
    return (
      <div styleName='row' key={index}>
        <div styleName='col-time'>
          <div styleName='label'>Time:</div>
          <div styleName='property'>
            <div styleName='text-faded'>{timeTitle}</div>
          </div>
        </div>
        <div styleName='col-block'>
          <div styleName='label'>Block:</div>
          <div styleName='property '>
            <div styleName='text-normal'>{integerWithDelimiter(trx.blockNumber)}</div>
          </div>
        </div>
        <div styleName='col-type'>
          <div styleName='label'>Type:</div>
          <div styleName='property'>
            {trx.credited
              ? (<span styleName='badge-in'>in</span>)
              : (<span styleName='badge-out'>out</span>)
            }
          </div>
        </div>
        <div styleName='col-txid'>
          <div styleName='label'>Hash:</div>
          <div styleName='property'>
            <div styleName='text-normal'>
              {blockExplorerUrl(trx.txHash)
                ? <a href={blockExplorerUrl(trx.txHash)} target='_blank' rel='noopener noreferrer'>{trx.txHash}</a>
                : trx.txHash
              }
            </div>
          </div>
        </div>
        <div styleName='col-from'>
          <div styleName='label'>From:</div>
          <div styleName='property'>
            <div styleName='text-light'>{trx.from()}</div>
          </div>
        </div>
        <div styleName='col-to'>
          <div styleName='label'>To:</div>
          <div styleName='property'>
            <div styleName='text-normal'>{trx.to()}</div>
          </div>
        </div>
        <div styleName='col-value'>
          <div styleName='label'>Value:</div>
          <div styleName='property'>
            <div styleName='value'>
              <TokenValue value={trx.value()} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { transactions, locale } = this.props
    const size = transactions.size()
    const endOfList = transactions.endOfList()
    const isFetching = transactions.isFetching()
    const data = buildTableData(transactions, locale)

    return (
      <Paper>
        <div styleName='root'>
          <div styleName='header'>
            <h3><Translate value='components.dashboard.TransactionsTable.latestTransactions' /></h3>
          </div>
          <div styleName='content'>
            {size
              ? (
                <div styleName='table'>
                  <div styleName='table-head'>
                    <div styleName='row'>
                      <div styleName='col-time'><Translate value='components.dashboard.TransactionsTable.time' /></div>
                      <div styleName='col-block'><Translate value='components.dashboard.TransactionsTable.block' />
                      </div>
                      <div styleName='col-type'><Translate value='components.dashboard.TransactionsTable.type' /></div>
                      <div styleName='col-txid'><Translate value='components.dashboard.TransactionsTable.hash' /></div>
                      <div styleName='col-from'><Translate value='components.dashboard.TransactionsTable.from' /></div>
                      <div styleName='col-to'><Translate value='components.dashboard.TransactionsTable.to' /></div>
                      <div styleName='col-value'><Translate value='components.dashboard.TransactionsTable.value' />
                      </div>
                    </div>
                  </div>
                </div>
              )
              : ''
            }
            {!size && endOfList
              ? (
                <div styleName='no-transactions-section'>
                  <div styleName='section-header'>
                    <h5 styleName='no-transactions'>No transactions found.</h5>
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
                <div styleName='section-header'>
                  <h5>{group.dateTitle}</h5>
                </div>
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
                  label={isFetching ? <Preloader
                    style={{ verticalAlign: 'middle', marginTop: -2 }}
                    size={24}
                    thickness={1.5}
                  /> : 'Load More'}
                  disabled={isFetching}
                  onTouchTap={this.handleLoadMore}
                />
              </div>
            )}
        </div>
      </Paper>
    )
  }
}

function buildTableData (transactions, locale) {
  moment.locale(locale)
  const groups = transactions.items()
    .reduce((data, trx) => {
      const groupBy = trx.date('YYYY-MM-DD')
      data[ groupBy ] = data[ groupBy ] || {
        dateBy: trx.date('YYYY-MM-DD'),
        dateTitle: <Moment date={trx.date('YYYY-MM-DD')} format={SHORT_DATE} />,
        transactions: [],
      }
      data[ groupBy ].transactions.push({
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
