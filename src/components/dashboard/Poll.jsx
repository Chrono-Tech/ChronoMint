import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FlatButton, RaisedButton } from 'material-ui'
import { Link } from 'react-router'

import TokenValue from './TokenValue/TokenValue'

import './Poll.scss'
import styles from 'layouts/partials/styles'

export default class Poll extends React.Component {

  static propTypes = {
    poll: PropTypes.object
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='head'>
          <div styleName='inner'>
            <div styleName='layer layer-head'>
              <div styleName='entry entry-date'>
                <div styleName='entry-title'>31</div>
                <div styleName='entry-label'>days left</div>
              </div>
              <div styleName='entry entry-status'>
                <div styleName='entry-badge'>Ongoing</div>
              </div>
            </div>
            <div styleName='layer layer-chart'>
            </div>
            <div styleName='layer layer-entries'>
              <div styleName='entry entry-published'>
                <div styleName='entry-label'>Published:</div>
                <div styleName='entry-value'>May 23, 2017</div>
              </div>
              <div styleName='entry entry-finished'>
                <div styleName='entry-label'>End date:</div>
                <div styleName='entry-value'>Jul 23, 2017</div>
              </div>
              <div styleName='entry entry-required'>
                <div styleName='entry-label'>Required votes:</div>
                <div styleName='entry-value'>120</div>
              </div>
              <div styleName='entry entry-received'>
                <div styleName='entry-label'>Received votes:</div>
                <div styleName='entry-value'>36</div>
              </div>
              <div styleName='entry entry-variants'>
                <div styleName='entry-label'>Variants:</div>
                <div styleName='entry-value'>15</div>
              </div>
              <div styleName='entry entry-documents'>
                <div styleName='entry-label'>Documents:</div>
                <div styleName='entry-value'>4</div>
              </div>
            </div>
          </div>
        </div>
        <div styleName='body'>
          <h3 styleName='title'>Allocate 15% of transaction fees to developers</h3>
          <div styleName='description'>
            With easy access to Broadband and DSL the number of people using
            the Internet has skyrocket in recent years. Email, instant messaging
            and file sharing with other Internet users has also provided a
            platform for faster spreading of viruses, Trojans and Spyware.
          </div>
        </div>
        <div styleName='foot'>
          <FlatButton
            label='Details'
            styleName='action'
            containerElement={
              <Link activeClassName={'active'} to={{ pathname: '/new/wallet', hash: '#deposit-tokens' }} />
            }
          />
          <RaisedButton label='Decline' styleName='action' />
          <RaisedButton label='Support' styleName='action' primary />
        </div>
      </div>
    )
  }
}
