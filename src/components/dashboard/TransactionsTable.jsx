import React from 'react'
import { RaisedButton } from 'material-ui'

import './TransactionsTable.scss'

export default class TransactionsTable extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const data = Array(4).fill(
      {
        title: 'April 10 2017',
        transactions: [
          { time: '12:12', block: 537297, type: 'in', txid: 'Name of transactiton', from: '0x93k3b6f0000000', to: '0x93k3b6f0000000', value: 1512000, currency: 'LHT' },
          { time: '12:12', block: 537297, type: 'out', txid: 'Name of transactiton', from: '0x93k3b6f0000000', to: '0x93k3b6f0000000', value: 1512000, currency: 'LHT' }
        ]
      }
    )

    return (
      <div styleName="root">
        <div styleName="header">
          <h3>Latest transactions</h3>
        </div>
        <div styleName="content">
          <div styleName="table">
            <div styleName="table-head">
              <div styleName="row">
                <div styleName="col-time">Time</div>
                <div styleName="col-block">Block</div>
                <div styleName="col-type">Type</div>
                <div styleName="col-txid">TxID</div>
                <div styleName="col-from">From</div>
                <div styleName="col-to">To</div>
                <div styleName="col-value">Value</div>
              </div>
            </div>
          </div>
          {data.map((group, index) => (
            <div styleName="section" key={index}>
              <div styleName="section-header">
                <h5>{group.title}</h5>
              </div>
              <div styleName="table">
                <div styleName="table-body">
                  { group.transactions.map((trx, index) => this.renderRow(trx, index)) }
                </div>
              </div>
            </div>
          ))}
        </div>
        <div styleName="footer">
          <RaisedButton label="All Transactions" primary />
        </div>
      </div>
    )
  }

  renderRow(trx, index) {

    const [value1, value2] = ('' + trx.value.toFixed(2)).split('.')

    return (
      <div styleName="row" key={index}>
        <div styleName="col-time"><div styleName="text-faded">{trx.time}</div></div>
        <div styleName="col-block"><div styleName="text-normal">{trx.block}</div></div>
        <div styleName="col-type">
          { trx.type === 'in'
            ? (<span styleName="badge-in">in</span>)
            : (<span styleName="badge-out">out</span>)
          }
        </div>
        <div styleName="col-txid"><div styleName="text-normal">{trx.txid}</div></div>
        <div styleName="col-from"><div styleName="text-light">{trx.from}</div></div>
        <div styleName="col-to"><div styleName="text-normal">{trx.to}</div></div>
        <div styleName="col-value">
          <div styleName="value">
            <span styleName="value1">{value1}</span>
            <span styleName="value2">.{value2} {trx.currency}</span>
          </div>
        </div>
      </div>
    )
  }
}
