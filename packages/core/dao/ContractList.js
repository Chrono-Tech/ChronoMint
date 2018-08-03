/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ContractModel from '../models/contracts/ContractModel'

import {
  AssetsManagerABI,
  AssetHolderABI,
  AssetDonatorABI,
  UserManagerABI,
  ContractsManagerABI,
  ERC20ManagerABI,
  MultiEventsHistoryABI,
  VotingManagerABI,
  WalletsManagerABI,
  PlatformsManagerABI,
  TokenManagementInterfaceABI,
  ChronoBankPlatformABI,
  PlatformTokenExtensionGatewayManagerEmitterABI,
  ChronoBankAssetABI,
} from './abi/'

import ContractsManagerDAO from './ContractsManagerDAO3'
import AssetHolderDAO from './AssetHolderDAO'
import ERC20ManagerDAO from './ERC20ManagerDAO'
import VotingManagerDAO from './VotingManagerDAO'
import PollInterfaceDAO from './PollInterfaceDAO'
import AssetDonatorDAO from './AssetDonatorDAO'
import UserManagerDAO from './UserManagerDAO'
import WalletsManagerDAO from './WalletsManagerDAO'
import AssetsManagerDAO from './AssetsManagerDAO'
import PlatformManagerDAO from './PlatformsManagerDAO'
import TokenManagementExtensionDAO from './TokenManagementExtensionDAO'
import ChronoBankPlatformDAO from './ChronoBankPlatformDAO'
import PlatformTokenExtensionGatewayManagerEmitterDAO from './PlatformTokenExtensionGatewayManagerEmitterDAO'
import ChronoBankAssetDAO from './ChronoBankAssetDAO'

console.log('AssetsManagerDAO: ', AssetsManagerDAO)
console.log('ChronoBankPlatformDAO: ', ChronoBankPlatformDAO)
console.log('PlatformTokenExtensionGatewayManagerEmitterDAO: ', PlatformTokenExtensionGatewayManagerEmitterDAO)

export const CONTRACTS_MANAGER = new ContractModel({
  type: 'ContractsManager',
  address: ContractsManagerABI.networks['4'].address, // @todo Add Network selection
  abi: ContractsManagerABI,
  DAOClass: ContractsManagerDAO,
})

export const ASSETS_MANAGER_LIBRARY = new ContractModel({
  type: 'AssetsManager',
  abi: AssetsManagerABI,
  DAOClass: AssetsManagerDAO,
})

export const ASSET_DONATOR_LIBRARY = new ContractModel({
  type: 'AssetDonator',
  abi: AssetDonatorABI,
  DAOClass: AssetDonatorDAO,
})

export const ASSET_HOLDER_LIBRARY = new ContractModel({
  type: 'TimeHolder',
  abi: AssetHolderABI,
  DAOClass: AssetHolderDAO,
})

// export const PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER_LIBRARY = new ContractModel({
//   type: 'PlatformTokenExtensionGatewayManagerEmitterDAO',
//   abi: PlatformTokenExtensionGatewayManagerEmitterABI,
//   DAOClass: PlatformTokenExtensionGatewayManagerEmitterDAO,
// })

export const CHRONOBANK_PLATFORM_LIBRARY = new ContractModel({
  type: 'ChronoBankPlatform',
  abi: ChronoBankPlatformABI,
  DAOClass: ChronoBankPlatformDAO,
})

export const CHRONOBANK_ASSET_LIBRARY = new ContractModel({
  type: 'ChronoBankAsset',
  abi: ChronoBankAssetABI,
  DAOClass: ChronoBankAssetDAO,
})

export const USER_MANAGER_LIBRARY = new ContractModel({
  type: 'UserManager',
  abi: UserManagerABI,
  DAOClass: UserManagerDAO,
})

export const POLL_INTERFACE_MANAGER = new ContractModel({
  type: 'PollInterfaceManager',
  abi: AssetHolderABI,
  DAOClass: PollInterfaceDAO,
})

export const PLATFORMS_MANAGER_LIBRARY = new ContractModel({
  type: 'PlatformsManager',
  abi: PlatformsManagerABI,
  DAOClass: PlatformManagerDAO,
})

export const TOKEN_MANAGMENT_EXTENSION_LIBRARY = new ContractModel({
  type: 'TOKEN_MANAGMENT_EXTENSION',
  abi: TokenManagementInterfaceABI,
  DAOClass: TokenManagementExtensionDAO,
})

export const VOTING_MANAGER_LIBRARY = new ContractModel({
  type: 'VotingManager',
  abi: VotingManagerABI,
  DAOClass: VotingManagerDAO,
})

export const ERC20_MANAGER = new ContractModel({
  type: 'ERC20Manager',
  abi: ERC20ManagerABI,
  DAOClass: ERC20ManagerDAO,
})

export const MULTI_EVENTS_HISTORY = new ContractModel({
  type: 'MultiEventsHistory',
  abi: MultiEventsHistoryABI,
  DAOClass: null,
})

export const WALLETS_MANAGER = new ContractModel({
  type: 'WalletsManager',
  abi: WalletsManagerABI,
  DAOClass: WalletsManagerDAO,
})
