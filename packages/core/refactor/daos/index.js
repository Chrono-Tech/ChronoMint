import { ContractModel } from 'src/models/index'

import CONTRACTS_MANAGER_ABI from '@laborx/sc-abi/build/contracts/ContractsManager.json'
import ERC20_LIBRARY_ABI from '@laborx/sc-abi/build/contracts/ERC20Library.json'
import ERC20_INTERFACE_ABI from '@laborx/sc-abi/build/contracts/ERC20Interface.json'
import MULTI_EVENTS_HISTORY_ABI from '@laborx/sc-abi/build/contracts/MultiEventsHistory.json'
import JOB_CONTROLLER_ABI from '@laborx/sc-abi/build/contracts/JobController.json'
import JOBS_DATA_PROVIDER_ABI from '@laborx/sc-abi/build/contracts/JobsDataProvider.json'
import BOARD_CONTROLLER_ABI from '@laborx/sc-abi/build/contracts/BoardController.json'
import IPFS_LIBRARY_ABI from '@laborx/sc-abi/build/contracts/IPFSLibrary.json'
import USER_LIBRARY_ABI from '@laborx/sc-abi/build/contracts/UserLibrary.json'

import ContractsManagerDAO from './lib/ContractsManagerDAO'
import ERC20LibraryDAO from './lib/ERC20LibraryDAO'
import JobControllerDAO from './lib/JobControllerDAO'
import BoardControllerDAO from './lib/BoardControllerDAO'
import ERC20TokenDAO from './lib/ERC20TokenDAO'
import JobsDataProviderDAO from "./lib/JobsDataProviderDAO"
import IPFSLibraryDAO from "./lib/IPFSLibraryDAO"
import UserLibraryDAO from "./lib/UserLibraryDAO"

export { default as ethDAO } from './lib/ETHDAO'
export { default as AbstractContractDAO } from './lib/AbstractContractDAO'
export { default as AbstractTokenDAO } from './lib/AbstractTokenDAO'
// export { default as EIP20TokenDAO } from './lib/EIP20TokenDAO'
export { default as ETHTokenDAO } from './lib/ETHTokenDAO'
export { default as ContractsManagerDAO } from './lib/ContractsManagerDAO'
export { default as JobControllerDAO } from './lib/JobControllerDAO'
export { default as JobsDataProviderDAO } from './lib/JobsDataProviderDAO'
export { default as BoardControllerDAO } from './lib/BoardControllerDAO'
export { default as ERC20LibraryDAO } from './lib/ERC20LibraryDAO'
export { default as UserLibraryDAO } from './lib/UserLibraryDAO'

export const CONTRACTS_MANAGER = new ContractModel({
  type: "ContractsManager",
  address: CONTRACTS_MANAGER_ABI.networks['88'].address,
  abi: CONTRACTS_MANAGER_ABI,
  DAOClass: ContractsManagerDAO,
})

export const ERC20_LIBRARY = new ContractModel({
  type: "ERC20Library",
  abi: ERC20_LIBRARY_ABI,
  DAOClass: ERC20LibraryDAO,
})

export const JOB_CONTROLLER = new ContractModel({
  type: "JobController",
  abi: JOB_CONTROLLER_ABI,
  DAOClass: JobControllerDAO,
})

export const JOBS_DATA_PROVIDER = new ContractModel({
  type: "JobsDataProvider",
  abi: JOBS_DATA_PROVIDER_ABI,
  DAOClass: JobsDataProviderDAO,
})

export const BOARD_CONTROLLER = new ContractModel({
  type: "BoardController",
  abi: BOARD_CONTROLLER_ABI,
  DAOClass: BoardControllerDAO,
})

export const MULTI_EVENTS_HISTORY = new ContractModel({
  type: 'MultiEventsHistory',
  abi: MULTI_EVENTS_HISTORY_ABI,
  DAOClass: null,
})

export const ERC20_INTERFACE = new ContractModel({
  type: 'ERC20Interface',
  abi: ERC20_INTERFACE_ABI,
  DAOClass: ERC20TokenDAO,
})

export const IPFS_LIBRARY = new ContractModel({
  type: 'IPFSLibrary',
  abi: IPFS_LIBRARY_ABI,
  DAOClass: IPFSLibraryDAO,
})

export const USER_LIBRARY = new ContractModel({
  type: 'UserLibrary',
  abi: USER_LIBRARY_ABI,
  DAOClass: UserLibraryDAO,
})

// export const MULTI_EVENTS_HISTORY = "MultiEventsHistory"
// export const BALANCE_HOLDER = "BalanceHolder"
// export const RECOVERY = "Recovery"
// export const RATINGS_AND_REPUTATION_LIBRARY = "RatingsAndReputationLibrary"
// export const IPFS_LIBRARY = "IPFSLibrary"
// export const SKILLS_LIBRARY = "SkillsLibrary"
// export const USER_FACTORY = "UserFactory"
// export const USER_LIBRARY = "UserLibrary"
// export const PAYMENT_GATEWAY = "PaymentGateway"
// export const PAYMENT_PROCESSOR = "PaymentProcessor"
