/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '@chronobank/core/models/Amount'
import { CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import moment from 'moment'
import { currentAccountEvents } from '@chronobank/core/redux/events/selectors'
import { DUCK_ASSETS_MANAGER } from '@chronobank/core/redux/assetsManager/constants'
import Moment from 'components/common/Moment/index'
import { SHORT_DATE } from '@chronobank/core/models/constants'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { TX_ISSUE, TX_OWNERSHIP_CHANGE, TX_REVOKE } from '@chronobank/core/dao/constants/ChronoBankPlatformDAO'
import { TX_PLATFORM_ATTACHED, TX_PLATFORM_DETACHED, TX_PLATFORM_REQUESTED } from '@chronobank/core/dao/constants/PlatformsManagerDAO'
import { TX_ASSET_CREATED } from '@chronobank/core/dao/constants/AssetsManagerDAO'
import TransactionsCollection from '@chronobank/core/models/wallet/TransactionsCollection'
import LogListModel from "@chronobank/core/models/LogListModel";
import { TX_PAUSED, TX_RESTRICTED, TX_UNPAUSED, TX_UNRESTRICTED } from '@chronobank/core/dao/constants/ChronoBankAssetDAO'

import './HistoryTable.scss'

function prefix (token) {
  return `Assets.HistoryTable.${token}`
}

function mapStateToProps (state) {
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  return {
    locale: state.get('i18n').locale,
    events: currentAccountEvents()(state),
  }
}

@connect(mapStateToProps)
export default class HistoryTable extends PureComponent {
  static propTypes = {
    events: PropTypes.instanceOf(LogListModel),
    locale: PropTypes.string,
  }

  buildTableData (eventItems, locale) {
    moment.locale(locale)
    const groups = eventItems
      .reduce((data, event) => {
        const group = moment(event.date).format('YYYY-MM-DD')
        console.log('buildTableData: ', event, group)

        data[group] = data[group] || {
          dateBy: group,
          dateTitle: <Moment date={event.date} format={SHORT_DATE} />,
          eventList: [],
        }
        data[group].eventList.push(event)

        return data
      }, {})

    return Object.values(groups)
  }

  renderList (eventList: Array) {
    const renderArrayList = []


    return renderArrayList
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

  renderValue (trx) {
    let value
    switch (trx.type()) {
      case TX_PAUSED:
      case TX_UNPAUSED:
        value = (<div><Translate value={prefix('token')} />: {trx.symbol()}</div>)
        break
      case TX_RESTRICTED:
        value = (
          <div>
            <div><Translate value={prefix('token')} />: {trx.symbol()}</div>
            <div><Translate value={prefix('user')} />: {trx.args().restricted} </div>
          </div>
        )
        break
      case TX_UNRESTRICTED:
        value = (
          <div>
            <div><Translate value={prefix('token')} />: {trx.symbol()}</div>
            <div><Translate value={prefix('user')} />: {trx.args().unrestricted} </div>
          </div>
        )
        break
      case TX_ISSUE:
      case TX_REVOKE:
        if (trx.symbol()) {
          value = (
            <TokenValue value={new Amount(trx.value(), trx.symbol())} />
          )
        } else {
          value = ''
        }
        break
      case TX_PLATFORM_ATTACHED:
      case TX_PLATFORM_DETACHED:
      case TX_PLATFORM_REQUESTED:
        value = trx.args().platform
        break
      case TX_OWNERSHIP_CHANGE:
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
      case TX_ASSET_CREATED:
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

  render () {

    const { events } = this.props
    const isLoading = events && events.isLoading
    const eventsList = Array.isArray(events.entries) ? events.entries : []
    const data = this.buildTableData(eventsList)
    console.log('HistoryTable data: ', data, this.props)

    let currentDate

    return (
      <div styleName='root'>
        <div styleName='header'>
          <h3><Translate value={prefix('title')} /></h3>
        </div>
        <div styleName='content'>
          {eventsList.map((event) => {
            return (<div styleName='section' key={event.key}>
              <div styleName='section-header'>
                <h5>{event.date}</h5>
              </div>
              <div styleName='table'>
                <div styleName='table-body'>
                  {event.eventList.map((item, index) => this.renderRow(item, index))}
                </div>
              </div>
            </div>)
          })}
        </div>
        { isLoading &&
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
}
