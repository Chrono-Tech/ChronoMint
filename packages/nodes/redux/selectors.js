/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NODES } from './constants'

/**
 * get nodes
 * @param {Map} state
 */
export const selectNodesState = (state) =>
  state.get(DUCK_NODES)

/**
 * get nodes.selected
 * @param {Map} state
 */
export const selectCurrentNetwork = createSelector(
  selectNodesState,
  (nodesState) =>
    nodesState.selected
)

/**
 * get nodes.selected.blockchain
 * @param {Map} state
 */
export const selectCurrentNetworkBlockchains = createSelector(
  selectNodesState,
  (nodesState) =>
    nodesState.selected.blockchain
)

/**
 * get nodes.selected.blockchain[blockchainId]
 * @param {string} blockchainId
 */
export const selectCurrentBlockchainInfo = (blockchainId) => createSelector(
  selectCurrentNetwork,
  (currentNetwork) =>
    currentNetwork && currentNetwork.blockchain[blockchainId]
)

/**
 * get nodes.availableNetworks.blocchain[blockchainId]
 * @param {string} blockchainId
 */
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

export const selectCurrentPrimaryNodeStatus = createSelector(
  selectCurrentPrimaryNode,
  (currentPrimaryNode) =>
    currentPrimaryNode && currentPrimaryNode.isOnline
)

export const selectCurrentPrimaryNodeSyncingStatus = createSelector(
  selectCurrentPrimaryNode,
  (currentPrimaryNode) =>
    currentPrimaryNode && currentPrimaryNode.isSyncing
)

const MAINNET = 'mainnet'
const TESTNET = 'testnet'
export const selectCurrentNetworkType = createSelector(
  selectCurrentNetwork,
  (currentNetwork) =>
    currentNetwork && currentNetwork.networkId === 1
      ? MAINNET
      : TESTNET
)

export const selectCurrentNetworkTitle = createSelector(
  selectCurrentNetwork,
  (currentNetwork) =>
    currentNetwork && currentNetwork.networkTitle
)

export const selectCoinType = (blockchain) => createSelector(
  [(state) => selectCurrentBlockchainInfo(blockchain)(state)],
  (currentBlockChainInfo) =>
    currentBlockChainInfo && currentBlockChainInfo.coinType
)

export const selectBlockchainNetworkId = (blockchain) => createSelector(
  [(state) => selectCurrentBlockchainInfo(blockchain)(state)],
  (currentBlockChainInfo) =>
    currentBlockChainInfo && currentBlockChainInfo.bcNetworkId
)
