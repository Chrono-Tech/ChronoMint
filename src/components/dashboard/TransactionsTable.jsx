import React from 'react'
import PropTypes from 'prop-types'

import { RaisedButton } from 'material-ui'

import './TransactionsTable.scss'

export default class TransactionsTable extends React.Component {

  static propTypes = {
    tokens: PropTypes.object,
    onLoadMore: PropTypes.func,
    isFetching: PropTypes.bool,
    transactions: PropTypes.object,
    endOfList: PropTypes.bool
  }

  render() {

    const data = buildTableData(this.props.transactions)

    return (
      <div styleName="root">
        <div styleName="header">
          <h3>Latest transactions</h3>
        </div>
        <div styleName="content">
          { this.props.transactions.size ? <div styleName="table">
            <div styleName="table-head">
              <div styleName="row">
                <div styleName="col-time">Time</div>
                <div styleName="col-block">Block</div>
                <div styleName="col-type">Type</div>
                <div styleName="col-txid">Hash</div>
                <div styleName="col-from">From</div>
                <div styleName="col-to">To</div>
                <div styleName="col-value">Value</div>
              </div>
            </div>
          </div> : '' }
          { !this.props.transactions.size ? <div styleName="section">
            <div styleName="section-header">
              <h5 styleName="no-transactions">No transactions found.</h5>
            </div>
          </div> : '' }
          { data.map((group, index) => (
            <div styleName="section" key={index}>
              <div styleName="section-header">
                <h5>{group.dateTitle}</h5>
              </div>
              <div styleName="table">
                <div styleName="table-body">
                  { group.transactions.map((item, index) => this.renderRow(item, index)) }
                </div>
              </div>
            </div>
          ))}
        </div>
        { this.props.endOfList || !this.props.transactions.size ? null : (
          <div styleName="footer">
            <RaisedButton label="Load More" primary disabled={this.props.isFetching} onTouchTap={() => this.props.onLoadMore()} />
          </div>
        )}
      </div>
    )
  }

  renderRow({ timeTitle, trx }, index) {

    const symbol = trx.symbol()
    const [ value1, value2 ] = trx.value().split('.')

    return (
      <div styleName="row" key={index}>
        <div styleName="col-time"><div styleName="text-faded">{timeTitle}</div></div>
        <div styleName="col-block"><div styleName="text-normal">{trx.blockNumber}</div></div>
        <div styleName="col-type">
          { trx.credited
            ? (<span styleName="badge-in">in</span>)
            : (<span styleName="badge-out">out</span>)
          }
        </div>
        <div styleName="col-txid"><div styleName="text-normal">{trx.txHash}</div></div>
        <div styleName="col-from"><div styleName="text-light">{trx.from}</div></div>
        <div styleName="col-to"><div styleName="text-normal">{trx.to}</div></div>
        <div styleName="col-value">
          <div styleName="value">
            <span styleName="value1">{value1}</span>
            {!value2 ? null : (
              <span styleName="value2">.{value2}</span>
            )}
            &nbsp;
            <span styleName="value3">{symbol}</span>
          </div>
        </div>
      </div>
    )
  }
}

function buildTableData(transactions) {

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
        timeBy: trx.date('HH:mm:SS'),
        timeTitle: trx.date('HH:mm'),
      })
      return data
    }, {})

  const data = Object.values(groups)
    .sort((a, b) => a.dateBy > b.dateBy ? -1 : a.dateBy < b.dateBy)
    .map((group) => ({
      ...group,
      transactions: group.transactions.sort((a, b) => a.timeBy > b.timeBy ? -1 : a.timeBy < b.timeBy)
    }))

  return data
}
