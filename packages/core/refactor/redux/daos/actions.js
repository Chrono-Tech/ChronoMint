/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ContractDAOModel } from '../../models/index'
import {
  CONTRACTS_MANAGER,
  MULTI_EVENTS_HISTORY,
  ASSET_MANAGER_LIBRARY,
  ERC20_MANAGER,
  VOTING_MANAGER_LIBRARY,
  ASSET_HOLDER_LIBRARY,
} from '../../daos/index'

export const DUCK_DAO = 'dao'
export const DAOS_REGISTER = 'daos/register'
export const DAOS_INITIALIZED = 'daos/initialized'

export const initDAOs = ({ web3 }) => async (dispatch, getState) => {
  const contractManagerDAO = CONTRACTS_MANAGER.create()
  await contractManagerDAO.connect(web3)

  dispatch({
    type: DAOS_REGISTER,
    model: new ContractDAOModel({
      contract: CONTRACTS_MANAGER,
      address: contractManagerDAO.address,
      dao: contractManagerDAO,
    }),
  })

  const history = await contractManagerDAO.getContractAddressByType(MULTI_EVENTS_HISTORY.type)

  const contracts = [
    ASSET_MANAGER_LIBRARY,
    ASSET_HOLDER_LIBRARY,
    ERC20_MANAGER,
    VOTING_MANAGER_LIBRARY,
  ]

  const models = await Promise.all(
    contracts.map(
      async (contract) => {
        const address = await contractManagerDAO.getContractAddressByType(contract.type)
        const dao = contract.create(address, history)
        console.log('contract.create(address, history): ', dao, dao.connect)
        dao.connect(web3)
        return new ContractDAOModel({
          contract,
          address,
          history,
          dao,
        })
      },
    ),
  )

  for (const model of models) {
    dispatch({
      type: DAOS_REGISTER,
      model,
    })
  }

  const state = getState()
  // post registration setup
  for (const model of models) {
    if (typeof model.postStoreDispatchSetup === 'function') {
      model.postStoreDispatchSetup(state, web3, history)
    }
  }

  dispatch({
    type: DAOS_INITIALIZED,
    isInitialized: true,
  })
}
