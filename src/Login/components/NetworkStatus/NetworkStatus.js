import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { constants } from 'Login/settings'
import './NetworkStatus.scss'

@connect(mapStateToProps)
export default class CopyIcon extends React.Component {

  static propTypes = {
    networkStatus: PropTypes.object,
    syncStatus: PropTypes.object
  }

  getStatus () {
    const {networkStatus, syncStatus} = this.props
    switch (networkStatus.status) {
      case constants.NETWORK_STATUS_ONLINE: {
        switch (syncStatus.status) {
          case constants.SYNC_STATUS_SYNCED:
            return 'synced'
          case constants.SYNC_STATUS_SYNCING:
          default:
            return 'syncing'
        }
      }
      case constants.NETWORK_STATUS_OFFLINE:
        return 'offline'
      case constants.NETWORK_STATUS_UNKNOWN:
      default:
        return 'unknown'
    }
  }

  render () {
    const status = this.getStatus()
    return (
      <div styleName='root'>
        <span styleName={`status status-${status}`}/>
        <Translate value={`networkStatus.${status}`}/>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const monitor = state.get('monitor')
  return {
    networkStatus: monitor.network,
    syncStatus: monitor.sync,
  }
}
