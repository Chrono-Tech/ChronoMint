/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import web3Provider from '../../network/Web3Provider'
import {
  CHANGE_NETWORK_STATUS,
  CHANGE_SYNC_STATUS,
} from './constants'

export const changeNetworkStatus = (status) => ({ type: CHANGE_NETWORK_STATUS, status })

export const changeSyncStatus = (status, progress) => ({ type: CHANGE_SYNC_STATUS, status, progress })

export const watchInitMonitor = () => (dispatch) => {
  web3Provider.getMonitorService()
    .on('network', (status) => dispatch(changeNetworkStatus(status)))
    .on('sync', (status, progress) => dispatch(changeSyncStatus(status, progress)))
}
