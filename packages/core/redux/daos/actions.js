/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ContractDAOModel from '../../models/contracts/ContractDAOModel'
import { alternateTxHandlingFlow } from '../tokens/actions'
import { getAccount } from '../session/selectors/models'
import AbstractContractDAO from '../../dao/AbstractContract3DAO'

//#region CONSTANTS

import {
  ASSET_HOLDER_LIBRARY,
  ASSET_DONATOR_LIBRARY,
  ASSETS_MANAGER_LIBRARY,
  PLATFORMS_MANAGER_LIBRARY,
  // PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER_LIBRARY,
  CHRONOBANK_PLATFORM_LIBRARY,
  CHRONOBANK_ASSET_LIBRARY,
  CONTRACTS_MANAGER,
  ERC20_MANAGER,
  USER_MANAGER_LIBRARY,
  MULTI_EVENTS_HISTORY,
  VOTING_MANAGER_LIBRARY,
  WALLETS_MANAGER,
  TOKEN_MANAGMENT_EXTENSION_LIBRARY,
} from '../../dao/ContractList'
import {
  DAOS_REGISTER,
  DAOS_INITIALIZED,
} from './constants'

//#endregion

// eslint-disable-next-line import/prefer-default-export
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

  const historyAddress = await contractManagerDAO.getContractAddressByType(MULTI_EVENTS_HISTORY.type)

  const contracts = [
    ASSETS_MANAGER_LIBRARY,
    ASSET_HOLDER_LIBRARY,
    ASSET_DONATOR_LIBRARY,
    PLATFORMS_MANAGER_LIBRARY,
    // PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER_LIBRARY,
    CHRONOBANK_PLATFORM_LIBRARY,
    CHRONOBANK_ASSET_LIBRARY,
    TOKEN_MANAGMENT_EXTENSION_LIBRARY,
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
        const dao = contract.create(address.toLowerCase(), historyAddress)
        dao.connect(web3)
        subscribeToFlow(dao)
        return new ContractDAOModel({
          contract,
          address,
          history: historyAddress,
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
      model.dao.postStoreDispatchSetup(state, web3, historyAddress, subscribeToFlow)
    }
  }

  dispatch({
    type: DAOS_INITIALIZED,
    isInitialized: true,
  })
}
