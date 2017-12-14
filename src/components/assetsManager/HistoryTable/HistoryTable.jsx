import Amount from 'models/Amount'
import { CircularProgress } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import moment from 'moment'
import { DUCK_ASSETS_MANAGER } from 'redux/assetsManager/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokensCollection from 'models/tokens/TokensCollection'
import Moment from 'components/common/Moment/index'
import { SHORT_DATE } from 'models/constants'
import TokenValue from 'components/common/TokenValue/TokenValue'

import './HistoryTable.scss'

function prefix (token) {
  return `Assets.HistoryTable.${token}`
}

function mapStateToProps (state) {
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  const tokens = state.get(DUCK_TOKENS)
  return {
    locale: state.get('i18n').locale,
    transactionsList: assetsManager.transactionsList,
    transactionsFetching: assetsManager.transactionsFetching,
    tokens,
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HistoryTable extends PureComponent {
  static propTypes = {
    tokens: PropTypes.instanceOf(TokensCollection),
    transactionsList: PropTypes.array,
    transactionsFetched: PropTypes.bool,
    transactionsFetching: PropTypes.bool,
  }

  render () {
    const data = this.buildTableData(this.props.transactionsList, this.props.locale)

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
                  {group.transactions.map((item, index) => this.renderRow(item, index))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {
          this.props.transactionsFetching &&
          <div styleName='footer'>
            <CircularProgress
              style={{ verticalAlign: 'middle', marginTop: -2 }}
              size={24}
              thickness={1.5}
            />
          </div>
        }
      </div>
    )
  }

  renderRow ({ trx, timeTitle }, index) {
    return (
      <div styleName='row' key={index}>
        <div styleName='col-time'>
          <div styleName='property'>
            <div styleName='text-faded'>{timeTitle}</div>
          </div>
        </div>

        <div styleName='col-type'>
          <div styleName='property'>
            <span styleName='badge-in'>{trx.type()}</span>
          </div>
        </div>

        <div styleName='col-manager'>
          <div styleName='property'>
            <div styleName='text-faded'>{trx.by()}</div>
          </div>
        </div>

        <div styleName='col-value'>
          <div styleName='property'>
            <div styleName='value'>
              {this.renderValue(trx)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  buildTableData (historyItems, locale) {
    moment.locale(locale)
    const groups = historyItems
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

  renderValue (trx) {
    let value
    switch (trx.type()) {
      case 'Issue':
      case 'Revoke':
        const token = this.props.tokens.item(trx.tokenAddress())
        if (trx.symbol() && token) {
          value = (
            <TokenValue value={new Amount(token.dao().removeDecimals(trx.value()), trx.symbol())} />
          )
        } else {
          value = ''
        }
        break
      case 'PlatformAttached':
      case 'PlatformRequested':
        value = trx.args().platform
        break
      case'OwnershipChange':
        value = (
          <div>
            <div><Translate value={prefix('token')} />: {trx.symbol()}</div>
            {
              trx.isFromEmpty()
                ? <span><Translate value={prefix('added')} />: {trx.to()}</span>
                : <span><Translate value={prefix('deleted')} />: {trx.from()}</span>
            }
          </div>
        )
        break
      case'AssetCreated':
        value = (
          <div>
            <div><Translate value={prefix('token')} />: {trx.symbol()}</div>
            <div><Translate value={prefix('platform')} />: {trx.args().platform} </div>
          </div>
        )
        break
      default:
        value = ''
    }
    return value
  }
}
