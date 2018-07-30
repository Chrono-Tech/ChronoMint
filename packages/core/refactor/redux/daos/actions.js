/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ContractDAOModel } from '../../models/index'
import {
  ASSET_HOLDER_LIBRARY,
  ASSET_DONATOR_LIBRARY,
  ASSETS_MANAGER_LIBRARY,
  PLATFORMS_MANAGER_LIBRARY,
  CONTRACTS_MANAGER,
  ERC20_MANAGER,
  USER_MANAGER_LIBRARY,
  MULTI_EVENTS_HISTORY,
  VOTING_MANAGER_LIBRARY,
  WALLETS_MANAGER,
} from '../../daos/index'
import { alternateTxHandlingFlow } from '../../../redux/tokens/actions'
import { getAccount } from '../../../redux/session/selectors/models'
import AbstractContractDAO from '../../daos/lib/AbstractContractDAO'

export const DUCK_DAO = 'dao'
export const DAOS_REGISTER = 'daos/register'
export const DAOS_INITIALIZED = 'daos/initialized'

export const initDAOs = ({ web3 }) => async (dispatch, getState) => {
  const account = getAccount(getState())
  AbstractContractDAO.setAccount(account)
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
    ASSETS_MANAGER_LIBRARY,
    ASSET_HOLDER_LIBRARY,
    ASSET_DONATOR_LIBRARY,
    PLATFORMS_MANAGER_LIBRARY,
    USER_MANAGER_LIBRARY,
    ERC20_MANAGER,
    VOTING_MANAGER_LIBRARY,
    WALLETS_MANAGER,
  ]

  const subscribeToFlow = (dao) => {
    dispatch(alternateTxHandlingFlow(dao))
  }

  const models = await Promise.all(
    contracts.map(
      async (contract) => {
        const address = await contractManagerDAO.getContractAddressByType(contract.type)
        const dao = contract.create(address.toLowerCase(), history)
        dao.connect(web3)
        subscribeToFlow(dao)
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
    if (typeof model.dao.postStoreDispatchSetup === 'function') {
      model.dao.postStoreDispatchSetup(state, web3, history, subscribeToFlow)
    }
  }

  dispatch({
    type: DAOS_INITIALIZED,
    isInitialized: true,
  })
}
