/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import TokenValue from 'components/common/TokenValue/TokenValue'
import LOCItemButtons from './LOCItemButtons'

import './LOCItem.scss'

const warningStyle = {
  fontSize: 16,
  position: 'absolute',
  right: 8,
  top: 8,
}

class LOCItem extends PureComponent {
  static propTypes = {
    loc: PropTypes.object,
  }

  renderStatus () {
    const { loc } = this.props

    return (
      <div styleName={`status ${loc.statusStyle()}`}>
        <Translate value={loc.statusString()} />
      </div>
    )
  }

  renderCircle ({ min, max, value }) {
    // TODO @dkchv: will be fully implement by @ipavlenko
    const minValue = Math.max(min, value)
    const maxValue = Math.min(max, value)
    const percent = minValue === value ? 0 : (maxValue - minValue) / (value - minValue)
    return (
      <div styleName='circle'>
        {`${percent}\u00a0%`}
      </div>
    )
  }

  render () {
    const { loc } = this.props
    const currency = loc.currency()

    return (
      <div styleName='root'>
        <div styleName='header'>
          <div styleName='icon'>
            <i
              style={{ fontSize: 40 }}
              color='rgba(14, 74, 149, 0.5)'
              className='material-icons'
            >account_circle
            </i>
            <div styleName='subIconBox'>
              <div styleName='subIconImg' />
            </div>
          </div>
          <div styleName='titleBox'>
            <div styleName='title'>{loc.name()}</div>
            <div styleName='subtitle'><Translate value='locs.addedOn' date={loc.createDateString()} /></div>
          </div>
        </div>
        {this.renderStatus()}
        {this.renderCircle({
          min: loc.createDate(),
          max: loc.expDate(),
          value: Date.now(),
        })}

        {loc.isPending() && (
          <CircularProgress
            size={16}
            thickness={1.5}
            style={warningStyle}
          />)}

        {loc.isFailed() && (
          <i
            style={warningStyle}
            color='redA700'
            className='material-icons'
          >error
          </i>)
        }

        <table styleName='table'>
          <tbody>
            <tr>
              <td>Issue limit:</td>
              <td>
                <TokenValue
                  value={loc.issueLimit()}
                  symbol={currency}
                />
              </td>
            </tr>
            <tr>
              <td>Total issued amount:</td>
              <td>
                <TokenValue
                  value={loc.issued()}
                  symbol={currency}
                />
              </td>
            </tr>
            <tr>
              <td>Create date:</td>
              <td>{loc.createDateString()}</td>
            </tr>
            <tr>
              <td>Expiration date:</td>
              <td>{loc.expDateString()}</td>
            </tr>
          </tbody>
        </table>
        <div styleName='footer'>
          <LOCItemButtons loc={loc} />
        </div>
      </div>
    )
  }
}

export default LOCItem
