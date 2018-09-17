/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NODES } from './constants'

export const selectNodesState = (state) =>
  state.get(DUCK_NODES)

export const selectCurrentNetwork = createSelector(
  selectNodesState,
  (nodesState) =>
    nodesState.selected
)

export const selectAvailableProviders = createSelector(
  selectNodesState,
  (nodesState) =>
    nodesState.availableNetworks
      .map((network) =>
        network.primaryNode.ws
      )
)

export const selectDisplayNetworksList = createSelector(
  selectNodesState,
  (nodesState) =>
    nodesState.displaySections
)

/**
 * Used when we are adding new custom network
 * @return {number} Amount of already configured networks
 */
export const selectNetworksCount = createSelector(
  selectNodesState,
  (nodesState) =>
    nodesState.availableNetworks.length
)

export const selectCurrentPrimaryNode = createSelector(
  selectCurrentNetwork,
  (currentNetwork) =>
    currentNetwork && currentNetwork.primaryNode
)

const MAINNET = 'mainnet'
const TESTNET = 'testnet'
export const selectCurrentNetworkType = createSelector(
  selectCurrentNetwork,
  (currentNetwork) =>
    currentNetwork.networkId === 1
      ? MAINNET
      : TESTNET
)
