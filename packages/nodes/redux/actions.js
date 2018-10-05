/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as NodesActionTypes from './constants'

export const nodesInit = () => ({
  type: NodesActionTypes.NODES_INIT,
})

export const getWeb3Instance = () => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_GET_WEB3,
})

export const getWeb3Provider = () => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_GET_WEB3,
})

export const primaryNodeGetWeb3Instance = () => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_GET_WEB3,
})

export const primaryNodeConnected = () => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_CONNECTED,
})

export const primaryNodeSwitch = () => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_SWITCH,
})

export const primaryNodeError = (url, error) => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_ERROR,
  error,
  url,
})

export const primaryNodeDisconnected = (url, error) => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_DISCONNECTED,
  error,
  url,
})

export const primaryNodeSetSyncingStatus = (status) => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_SYNC_STATUS,
  status,
})

export const primaryNodeSyncingStatusStop = (status) => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_SYNC_STATUS_STOP,
  status,
})

export const networkSwitch = (networkIndex) => ({
  type: NodesActionTypes.NODES_NETWORK_SWITCH,
  networkIndex,
})

export const networkSelect = (networkIndex) => ({
  type: NodesActionTypes.NODES_NETWORK_SELECT,
  networkIndex,
})

export const addCustomNetwork = (host, networkTitle, alias, ws) => ({
  type: NodesActionTypes.NODES_PRIMARY_NODE_ADD_CUSTOM_NODE,
  host,
  networkTitle,
  alias,
  ws,
})
