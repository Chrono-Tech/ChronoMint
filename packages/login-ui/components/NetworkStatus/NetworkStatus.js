/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { NETWORK_STATUS_OFFLINE, NETWORK_STATUS_ONLINE, NETWORK_STATUS_UNKNOWN, SYNC_STATUS_SYNCED, SYNC_STATUS_SYNCING } from '@chronobank/login/network/MonitorService'
import { getNetworkById, getProviderById } from '@chronobank/login/network/settings'
import { DUCK_MONITOR } from '@chronobank/login/redux/monitor/constants'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import './NetworkStatus.scss'

const selectProvider = (providerId) => {
  const provider = getProviderById(providerId)
  return provider.name
}

const selectNetwork = (networkId, providerId) => {
  const network = getNetworkById(networkId, providerId)
  return network.name
}

const formatPercent = (value) => Math.round(value * 10000) / 100

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
  const network = state.get(DUCK_NETWORK)
  return {
    status: selectStatus(monitor),
    sync: monitor.sync,
    provider: selectProvider(network.selectedProviderId),
    network: selectNetwork(network.selectedNetworkId, network.selectedProviderId),
  }
}

@connect(mapStateToProps)
export default class NetworkStatus extends PureComponent {
  static propTypes = {
    provider: PropTypes.string,
    network: PropTypes.string,
    status: PropTypes.string,
    sync: PropTypes.shape({
      status: PropTypes.string,
      progress: PropTypes.number,
    }),
  }

  render () {
    const { status, sync, provider, network } = this.props

    return (
      <div styleName='root'>
        <span styleName={`status status-${status}`} />
        {provider && `${provider}${network ? ` / ${network} ` : ' '}`}
        <Translate value={`networkStatus.${status}`} />
        {sync.status === SYNC_STATUS_SYNCING && sync.progress > 0 && ` - ${formatPercent(sync.progress)}%`}
      </div>
    )
  }
}
