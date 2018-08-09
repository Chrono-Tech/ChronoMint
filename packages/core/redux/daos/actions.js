/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import ContractDAOModel from '../../models/contracts/ContractDAOModel'
import { getAccount } from '../session/selectors/models'
import AbstractContractDAO from '../../dao/AbstractContract3DAO'
import { ContractsManagerABI } from '../../dao/abi'

import {
  ASSET_HOLDER_LIBRARY,
  ASSET_DONATOR_LIBRARY,
  ASSETS_MANAGER_LIBRARY,
  PLATFORMS_MANAGER_LIBRARY,
  PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER_LIBRARY,
  CONTRACTS_MANAGER,
  ERC20_MANAGER,
  USER_MANAGER_LIBRARY,
  MULTI_EVENTS_HISTORY,
  VOTING_MANAGER_LIBRARY,
  WALLETS_MANAGER,
  // TOKEN_MANAGMENT_EXTENSION_LIBRARY,
} from '../../dao/ContractList'

import {
  DAOS_REGISTER,
  DAOS_INITIALIZED,
} from './constants'

// eslint-disable-next-line import/prefer-default-export
export const initDAOs = ({ web3 }) => async (dispatch, getState) => {
  const account = getAccount(getState())
  AbstractContractDAO.setAccount(account)
  const currentNetworkId = networkService.getCurrentNetwork()
  const contractManagerAddress = ContractsManagerABI.networks[currentNetworkId].address
  const contractManagerDAO = CONTRACTS_MANAGER.create(contractManagerAddress)
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
    // TOKEN_MANAGMENT_EXTENSION_LIBRARY,
    USER_MANAGER_LIBRARY,
    ERC20_MANAGER,
    VOTING_MANAGER_LIBRARY,
    WALLETS_MANAGER,
  ]

  const getDaoModel = async (contract, address: String) => {
    let contractAddress = address
    if (!contractAddress) {
      contractAddress = await contractManagerDAO.getContractAddressByType(contract.type)
    }
    const dao = contract.create(contractAddress.toLowerCase(), historyAddress)
    dao.connect(web3)
    return new ContractDAOModel({
      contract,
      contractAddress,
      history: historyAddress,
      dao,
    })
  }

  const models = await Promise.all(
    contracts.map((contract) => {
      return getDaoModel(contract)
    }),
  )

  const tokenManagementInterfaceDAO = models.find((model) => {
    return model && model.contract && model.contract.type === 'TokenManagementInterface'
  })
  if (tokenManagementInterfaceDAO) {
    const platfromTokenExtension = await getDaoModel(PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER_LIBRARY, tokenManagementInterfaceDAO.address)
    models.push(platfromTokenExtension)
  }

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
      model.dao.postStoreDispatchSetup(state, web3, historyAddress)
    }
  }

  dispatch({
    type: DAOS_INITIALIZED,
    isInitialized: true,
  })
}
