/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as NetworkSetActionTypes from './constants'

import productionNetworks from './production.json'
import testNetworks from './test.json'
import developNetworks from './develop.json'

/* NOTE: order in networkSections array is important.
 * In this order networks and sections will be dipalyed in CommonNetworkSelector:
 *
 * Production Networks
 *    ChronoBank - Mainnet [0]
 *    Infura - Mainnet [1]
 * Test Networks
 *    ChronoBank - Testnet [2]
 *    Infura - Testnet [3]
 * Developer Networks
 *    ChronoBank - Private [4]
 */

const networkSections = [
  productionNetworks,
  testNetworks,
]

// Only for development purposes
if (process.env['NODE_ENV'] === 'development') {
  networkSections.push(developNetworks)
}

const initialState = () => {
  let networkIndex = 0
  const displayNetworksList = []
  const availableNetworks = networkSections
    .reduce((sectionsAccumulator, section) => {
      const networks = section.networks
        .reduce((networksAccumulator, network) => {
          networksAccumulator.push({ ...network, networkIndex })

          return networksAccumulator
        }, [])

      sectionsAccumulator.push(...networks)

      // This is just a data for UI (to display it in "Select Network" popover)
      displayNetworksList.push({
        sectionTitle: section.sectionTitle,
        sectionDescription: section.sectionDescription,
        networks: networks.map((network) => ({
          networkTitle: network.networkTitle,
          networkIndex: networkIndex++, // Just counting networks in array. Will be used in NetworkSelector to extract selected network
        })),
      })

      return sectionsAccumulator
    }, [])

  return {
    displayNetworksList,
    availableNetworks,
    selected: availableNetworks[2], // Selecting "Chronobank - Rinkeby (test network)" by default
  }
}

const mutations = {

  [NetworkSetActionTypes.NETSET_SWITCH]: (state, { networkIndex }) => ({
    ...state,
    selected: state.availableNetworks[networkIndex],
  }),

}

export default (state = initialState(), { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
