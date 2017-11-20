import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import { DUCK_MONITOR } from '../../redux/monitor/actions'
import { NETWORK_STATUS_OFFLINE, NETWORK_STATUS_ONLINE, NETWORK_STATUS_UNKNOWN, SYNC_STATUS_SYNCED, SYNC_STATUS_SYNCING } from '../../network/MonitorService'

import './NetworkStatus.scss'

const selectStatus = ({ network, sync }) => {
  switch (network.status) {
    case NETWORK_STATUS_ONLINE: {
      switch (sync.status) {
        case SYNC_STATUS_SYNCED:
          return 'synced'
        case SYNC_STATUS_SYNCING:
        default:
          return 'syncing'
      }
    }
    case NETWORK_STATUS_OFFLINE:
      return 'offline'
    case NETWORK_STATUS_UNKNOWN:
    default:
      return 'unknown'
  }
}

function mapStateToProps (state) {
  const monitor = state.get(DUCK_MONITOR)
  return {
    status: selectStatus(monitor),
    sync: monitor.sync,
  }
}

@connect(mapStateToProps)
export default class CopyIcon extends PureComponent {
  static propTypes = {
    status: PropTypes.string,
    sync: PropTypes.shape({
      status: PropTypes.string,
      progress: PropTypes.number,
    }),
  }

  render () {
    const { status, sync } = this.props

    return (
      <div styleName='root'>
        <span styleName={`status status-${status}`} />
        <Translate value={`networkStatus.${status}`} />
        {sync.status === SYNC_STATUS_SYNCING && ` - ${sync.progress}%`}
      </div>
    )
  }
}
