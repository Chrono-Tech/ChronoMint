/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

 import { DUCK_NODES } from '@chronobank/nodes/redux/constants'
import ContractDAOModel from '../../models/contracts/ContractDAOModel'
import { getAccount } from '../session/selectors/models'
import AbstractContractDAO from '../../dao/AbstractContractDAO'
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
} from '../../dao/ContractList'

import {
  DAOS_REGISTER,
  DAOS_INITIALIZED,
} from './constants'

export const registerDao = (model) => ({ type: DAOS_REGISTER, model })

// eslint-disable-next-line import/prefer-default-export
export const initDAOs = ({ web3 }) => async (dispatch, getState) => {
  let state = getState()
  const account = getAccount(state)
  const currentNetwork = state.get(DUCK_NODES).selected.networkId
  AbstractContractDAO.setAccount(account)
  const currentNetworkId = currentNetwork
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
    USER_MANAGER_LIBRARY,
    ERC20_MANAGER,
    VOTING_MANAGER_LIBRARY,
    WALLETS_MANAGER,
  ]

  const getDaoModel = async (contract, contractAddress: string, isGetAddressFromContract: boolean = true) => {
    let address = contractAddress
    if (!address && isGetAddressFromContract) {
      address = await contractManagerDAO.getContractAddressByType(contract.type)
      address = typeof address === 'string' ? address.toLowerCase() : null
    }

    const dao = contract.create(address, historyAddress)
    dao.connect(web3)
    return new ContractDAOModel({
      contract,
      address,
      history: historyAddress,
      dao,
    })
  }

  const models = await Promise.all(
    contracts.map((contract) => {
      return getDaoModel(contract)
    }),
  )

  const platformTokenExtensionGatewayManagerEmitter = await getDaoModel(PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER_LIBRARY, null, false)
  models.push(platformTokenExtensionGatewayManagerEmitter)

  for (const model of models) {
    dispatch({
      type: DAOS_REGISTER,
      model,
    })
  }

  state = getState()
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
