/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as NetworkSetActionTypes from './constants'

import productionNetworks from './production.json'
import testNetworks from './test.json'
import developNetworks from './develop.json'

const networkSections = [
  productionNetworks,
  testNetworks,
  developNetworks,
]

const initialState = () => {
  let networkIndex = 0
  const displayNetworksList = []
  const availableNetworks = networkSections
    .reduce((sectionsAccumulator, section) => {
      const networks = section.networks
        .reduce((networksAccumulator, network) => {
          networksAccumulator.push(network)

          return networksAccumulator
        }, [])

      sectionsAccumulator.push({
        sectionTitle: section.sectionTitle,
        networks,
      })

      displayNetworksList.push({
        sectionTitle: section.sectionTitle,
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
    selected: {
      availableNetworks: availableNetworks[2], // Selecting "Infura - Rinkeby (test network)" by default
    },
  }
}

const mutations = {

  [NetworkSetActionTypes.NETSET_SWITCH]: (state, action) => ({
    ...state,
    selected: action.payload,
  }),

}

export default (state = initialState(), { type, ...other }) => {
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
