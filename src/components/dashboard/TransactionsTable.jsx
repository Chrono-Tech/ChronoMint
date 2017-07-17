import React from 'react'
import PropTypes from 'prop-types'
import { RaisedButton, CircularProgress } from 'material-ui'
import { integerWithDelimiter } from '../../utils/formatter'
import './TransactionsTable.scss'
import TokenValue from './TokenValue/TokenValue'
import { getEtherscanUrl } from 'network/settings'

export default class TransactionsTable extends React.Component {

  static propTypes = {
    tokens: PropTypes.object,
    onLoadMore: PropTypes.func,
    isFetching: PropTypes.bool,
    transactions: PropTypes.object,
    endOfList: PropTypes.bool,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number
  }

  render () {
    const data = buildTableData(this.props.transactions)

    return (
      <div styleName='root'>
        <div styleName='header'>
          <h3>Latest transactions</h3>
        </div>
        <div styleName='content'>
          { this.props.transactions.size ? <div styleName='table'>
            <div styleName='table-head'>
              <div styleName='row'>
                <div styleName='col-time'>Time</div>
                <div styleName='col-block'>Block</div>
                <div styleName='col-type'>Type</div>
                <div styleName='col-txid'>Hash</div>
                <div styleName='col-from'>From</div>
                <div styleName='col-to'>To</div>
                <div styleName='col-value'>Value</div>
              </div>
            </div>
          </div> : '' }
          { !this.props.transactions.size && this.props.endOfList ? <div styleName='section'>
            <div styleName='section-header'>
              <h5 styleName='no-transactions'>No transactions found.</h5>
            </div>
          </div> : '' }
          { !this.props.transactions.size && !this.props.endOfList ? <div styleName='section'>
            <div styleName='section-header'>
              <div styleName='txs-loading'><CircularProgress size={24} thickness={1.5} /></div>
            </div>
          </div> : '' }
          { data.map((group, index) => (
            <div styleName='section' key={index}>
              <div styleName='section-header'>
                <h5>{group.dateTitle}</h5>
              </div>
              <div styleName='table'>
                <div styleName='table-body'>
                  { group.transactions.map((item, index) => this.renderRow(item, index)) }
                </div>
              </div>
            </div>
          ))}
        </div>
        { this.props.endOfList || !this.props.transactions.size ? null : (
          <div styleName='footer'>
            <RaisedButton
              label={this.props.isFetching ? <CircularProgress
              style={{verticalAlign: 'middle', marginTop: -2}} size={24}
              thickness={1.5} /> : 'Load More'}
              primary
              disabled={this.props.isFetching}
              onTouchTap={() => this.props.onLoadMore()} />
          </div>
        )}
      </div>
    )
  }

  renderRow ({timeTitle, trx}, index) {
    const etherscanHref = (txHash) => getEtherscanUrl(this.props.selectedNetworkId, this.props.selectedProviderId, txHash)
    return (
      <div styleName='row' key={index}>
        <div styleName='col-time'>
          <div styleName='label'>Time: </div>
          <div styleName='property'>
            <div styleName='text-faded'>{timeTitle}</div>
          </div>
        </div>
        <div styleName='col-block'>
          <div styleName='label'>Block: </div>
          <div styleName='property '>
            <div styleName='text-normal'>{integerWithDelimiter(trx.blockNumber)}</div>
          </div>
        </div>
        <div styleName='col-type'>
          <div styleName='label'>Type: </div>
          <div styleName='property'>
            {trx.credited
              ? (<span styleName='badge-in'>in</span>)
              : (<span styleName='badge-out'>out</span>)
            }
          </div>
        </div>
        <div styleName='col-txid'>
          <div styleName='label'>Hash: </div>
          <div styleName='property'>
            <div styleName='text-normal'>
              { etherscanHref(trx.txHash)
                ? <a href={etherscanHref(trx.txHash)} target='_blank' rel='noopener noreferrer'>{trx.txHash}</a>
                : trx.txHash
              }
            </div>
          </div>
        </div>
        <div styleName='col-from'>
          <div styleName='label'>From: </div>
          <div styleName='property'>
            <div styleName='text-light'>{trx.from()}</div>
          </div>
        </div>
        <div styleName='col-to'>
          <div styleName='label'>To: </div>
          <div styleName='property'>
            <div styleName='text-normal'>{trx.to()}</div>
          </div>
        </div>
        <div styleName='col-value'>
          <div styleName='label'>Value: </div>
          <div styleName='property'>
            <div styleName='value'>
              <TokenValue
                value={trx.value()}
                symbol={trx.symbol()}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function buildTableData (transactions) {

  const groups = transactions.valueSeq().toArray()
    .reduce((data, trx) => {
      const groupBy = trx.date('YYYY-MM-DD')
      data[groupBy] = data[groupBy] || {
        dateBy: trx.date('YYYY-MM-DD'),
        dateTitle: trx.date('MMMM DD YYYY'),
        transactions: []
      }
      data[groupBy].transactions.push({
        trx,
        timeBy: trx.date('HH:mm:ss'),
        timeTitle: trx.date('HH:mm')
      })
      return data
    }, {})

  return Object.values(groups)
    .sort((a, b) => a.dateBy > b.dateBy ? -1 : a.dateBy < b.dateBy)
    .map((group) => ({
      ...group,
      transactions: group.transactions.sort((a, b) => a.timeBy > b.timeBy ? -1 : a.timeBy < b.timeBy)
    }))
}
