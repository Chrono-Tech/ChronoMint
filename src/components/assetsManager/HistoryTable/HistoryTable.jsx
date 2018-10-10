/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import moment from 'moment'
import { getHistoryEvents } from '@chronobank/core/redux/events/selectors'
import { loadEvents } from '@chronobank/core/redux/events/actions'
import { ASSET_TOPICS } from '@chronobank/core/describers/topics'
import LogListModel from '@chronobank/core/models/LogListModel'
import { getHistoryKey } from '@chronobank/core/utils/eventHistory'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'

import './HistoryTable.scss'

function prefix (token) {
  return `Assets.HistoryTable.${token}`
}

function mapStateToProps (state) {
  const account = state.get(DUCK_SESSION).account
  const historyKey = getHistoryKey(ASSET_TOPICS, account)

  return {
    locale: state.get('i18n').locale,
    events: getHistoryEvents(historyKey)(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onLoadMoreEvents: () => dispatch(loadEvents(ASSET_TOPICS)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HistoryTable extends PureComponent {
  static propTypes = {
    events: PropTypes.instanceOf(LogListModel),
    onLoadMoreEvents: PropTypes.func,
  }

  getEventTypePath (eventType: string) {
    return `tx.eventType.${eventType}`
  }

  buildTableData (eventItems, locale) {
    moment.locale(locale)
    const groups = eventItems
      .reduce((data, event) => {
        const group = moment(event.date).format('YYYY-MM-DD')

        data[group] = data[group] || {
          dateBy: group,
          dateTitle: moment(event.date).format('DD MMMM, YYYY'),
          eventList: [],
        }
        data[group].eventList.push(event)

        return data
      }, {})

    return Object.values(groups)
  }

  renderRow (event, index) {
    return (
      <div styleName='row' key={index}>
        <div styleName='col-time'>
          <div styleName='text-faded'>{moment(event.date).format('hh:mm A')}</div>
        </div>

        <div styleName='col-value'>
          <div styleName='col-value-container'>
            <div styleName='event-type-container'>
              <span styleName='event-type'>
                <Translate value={this.getEventTypePath(event.type)} />
              </span>
            </div>
            <div styleName='event-title-container'>
              <span styleName='event-title'>
                <Translate value={event.eventTitle || event.title} />
              </span>
            </div>
            <div styleName='event-address-container'>
              <span styleName='event-address'>{event.subTitle}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { events } = this.props
    const isLoading = events && events.isLoading
    const eventsList = Array.isArray(events && events.entries) ? events.entries : []
    const data = this.buildTableData(eventsList)

    return (
      <div styleName='root'>
        <div styleName='header'>
          <h3><Translate value={prefix('title')} /></h3>
        </div>
        <div styleName='content'>
          {data.map((group) => {
            return (
              <div styleName='section' key={group.dateBy}>
                <div styleName='section-header'>
                  <h5>{group.dateTitle}</h5>
                </div>
                <div styleName='table'>
                  {group.eventList.map((item, index) => this.renderRow(item, index))}
                </div>
              </div>
            )
          })}
        </div>
        { !isLoading &&
          <div styleName='load-more'>
            <button styleName='load-more-button' onClick={this.props.onLoadMoreEvents}>Load more</button>
          </div>
        }
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
