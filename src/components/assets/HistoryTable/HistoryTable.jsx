import React from 'react'
import PropTypes from 'prop-types'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import moment from 'moment'
import BigNumber from 'bignumber.js'

function prefix (token) {
  return 'Assets.HistoryTable.' + token
}

import './HistoryTable.scss'
import Moment, { SHORT_DATE } from 'components/common/Moment/index'

function mapStateToProps (state) {
  return {
    locale: state.get('i18n').locale
  }
}

@connect(mapStateToProps)
export default class HistoryTable extends React.Component {

  static propTypes = {
    tokens: PropTypes.object,
    onLoadMore: PropTypes.func,
    isFetching: PropTypes.bool,
    transactions: PropTypes.object,
    historyItems: PropTypes.object,
    endOfList: PropTypes.bool,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,
    locale: PropTypes.string
  }

  static defaultProps = {
    historyItems: [
      {
        date: new Date(),
        type: 'issue',
        manager: 'admin',
        value: new BigNumber(1231),
        symbol: 'LHT'
      },
      {
        date: new Date(),
        type: 'revoke',
        manager: '0x9876f6477iocc4757q22dfg3333nmk1111v234x0',
        value: new BigNumber(423),
        symbol: 'LHT'
      },
      {
        date: new Date(),
        type: 'revoke',
        manager: '0xr4lk2jr3lj1111v234x0',
        value: new BigNumber(423111),
        symbol: 'LHT'
      }
    ]
  }

  render () {
    const data = this.buildTableData(this.props.historyItems, this.props.locale)

    return (
      <div styleName='root'>
        <div styleName='header'>
          <h3><Translate value={prefix('title')} /></h3>
        </div>
        <div styleName='content'>
          {data.length ? <div styleName='table'>
            <div styleName='table-head'>
              <div styleName='row'>
                <div styleName='col-time'><Translate value={prefix('time')} /></div>
                <div styleName='col-type'><Translate value={prefix('type')} /></div>
                <div styleName='col-manager'><Translate value={prefix('manager')} /></div>
                <div styleName='col-value'><Translate value={prefix('value')} /></div>
              </div>
            </div>
          </div> : ''}
          {data.map((group, index) => (
            <div styleName='section' key={index}>
              <div styleName='section-header'>
                <h5>{group.dateTitle}</h5>
              </div>
              <div styleName='table'>
                <div styleName='table-body'>
                  {group.items.map((item, index) => this.renderRow(item, index))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderRow ({item, timeTitle}, index) {
    return (
      <div styleName='row' key={index}>
        <div styleName='col-time'>
          <div styleName='property'>
            <div styleName='text-faded'>{timeTitle}</div>
          </div>
        </div>

        <div styleName='col-type'>
          <div styleName='property'>
            {item.type === 'issue'
              ? (<span styleName='badge-in'>issue</span>)
              : (<span styleName='badge-out'>revoke</span>)
            }
          </div>
        </div>

        <div styleName='col-manager'>
          <div styleName='property'>
            <div styleName='text-faded'>{item.manager}</div>
          </div>
        </div>

        <div styleName='col-value'>
          <div styleName='property'>
            <div styleName='value'>
              <TokenValue
                value={item.value}
                symbol={item.symbol}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  buildTableData (historyItems, locale) {
    moment.locale(locale)
    const groups = historyItems
      .reduce((data, item) => {
        const groupBy = moment(item.date).format('YYYY-MM-DD')
        data[groupBy] = data[groupBy] || {
          dateBy: moment(item.date).format('YYYY-MM-DD'),
          dateTitle: <Moment date={item.date} format={SHORT_DATE} />,
          items: []
        }
        data[groupBy].items.push({
          item,
          timeBy: moment(item.date).format('HH:mm:ss'),
          timeTitle: moment(item.date).format('HH:mm'),
        })
        return data
      }, {})

    return Object.values(groups)
      .sort((a, b) => a.dateBy > b.dateBy ? -1 : a.dateBy < b.dateBy)
      .map((group) => ({
        ...group,
        items: group.items.sort((a, b) => a.timeBy > b.timeBy ? -1 : a.timeBy < b.timeBy)
      }))
  }
}


