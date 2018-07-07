/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ContractModel } from '../models/index'

import {
  MultiEventsHistoryABI,
  ContractsManagerABI,
  AssetsManagerABI,
  VotingManagerABI,
} from '../../../core/dao/abi/'

import ContractsManagerDAO from './lib/ContractsManagerDAO'
import AssetManagerLibraryDAO from './lib/AssetManagerLibraryDAO'

export { default as ethDAO } from './lib/ETHDAO'
export { default as AbstractContractDAO } from './lib/AbstractContractDAO'
export { default as AbstractTokenDAO } from './lib/AbstractTokenDAO'
// export { default as EIP20TokenDAO } from './lib/EIP20TokenDAO'
export { default as ETHTokenDAO } from './lib/ETHTokenDAO'
export { default as ContractsManagerDAO } from './lib/ContractsManagerDAO'
export { default as ERC20LibraryDAO } from './lib/ERC20LibraryDAO'
// export { default as VotingManagerDAO } from './lib/VotingManagerDAO'

console.log('ContractsManagerABI.networks: ', ContractsManagerABI.networks)

export const CONTRACTS_MANAGER = new ContractModel({
  type: "ContractsManager",
  address: ContractsManagerABI.networks['4'].address, // @todo Add Network selection
  abi: ContractsManagerABI,
  DAOClass: ContractsManagerDAO,
})

export const ASSET_MANAGER_LIBRARY = new ContractModel({
  type: "AssetManagerLibrary",
  abi: AssetsManagerABI,
  DAOClass: AssetManagerLibraryDAO,
})

// export const VOTING_MANAGER_LIBRARY = new ContractModel({
//   type: "VotingManagerLibrary",
//   abi: VotingManagerABI,
//   DAOClass: VotingManagerDAO,
// })

export const MULTI_EVENTS_HISTORY = new ContractModel({
  type: 'MultiEventsHistory',
  abi: MultiEventsHistoryABI,
  DAOClass: null,
})

// export const ERC20_LIBRARY = new ContractModel({
//   type: "ERC20Library",
//   abi: ERC20_LIBRARY_ABI,
//   DAOClass: ERC20LibraryDAO,
// })
