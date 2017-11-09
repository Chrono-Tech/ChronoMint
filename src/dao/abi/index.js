/* eslint-disable */
function optionalRequire (path:string = '') {
  let result = {}
  try {
    result = require('chronobank-smart-contracts/build/contracts/' + path)
  } catch (e) {
    console.warn('contract not found:', path)
  }
  return result
}

export const ChronoBankPlatformABI = optionalRequire('ChronoBankPlatform.json')
export const MultiEventsHistoryABI = optionalRequire('MultiEventsHistory.json')
export const WalletABI = optionalRequire('Wallet.json')
export const ContractsManagerABI = optionalRequire('ContractsManager.json')
export const ERC20ManagerABI = optionalRequire('ERC20Manager.json')
export const ExchangeABI = optionalRequire('Exchange.json')
export const FakeCoinABI = optionalRequire('FakeCoin.json')
export const FeeInterfaceABI = optionalRequire('FeeInterface.json')
export const ChronoBankAssetWithFeeProxyABI = optionalRequire('ChronoBankAssetWithFeeProxy.json')
export const LOCManagerABI = optionalRequire('LOCManager.json')
export const PendingManagerABI = optionalRequire('PendingManager.json')
export const PlatformsManagerABI = optionalRequire('PlatformsManager.json')
export const PlatformTokenExtensionGatewayManagerEmitterABI = optionalRequire('PlatformTokenExtensionGatewayManagerEmitter.json')
export const RewardsABI = optionalRequire('Rewards.json')
export const TimeHolderABI = optionalRequire('TimeHolder.json')
export const TokenManagementInterfaceABI = optionalRequire('TokenManagementInterface.json')
export const UserManagerABI = optionalRequire('UserManager.json')
export const VoteActorABI = optionalRequire('VoteActor.json')
export const PollManagerABI = optionalRequire('PollManager.json')
export const PollDetailsABI = optionalRequire('PollDetails.json')
export const WalletsManagerABI = optionalRequire('WalletsManager.json')
export const AssetDonatorABI = optionalRequire('AssetDonator.json')
export const ChronoBankAssetProxyABI = optionalRequire('ChronoBankAssetProxy.json')
export const AssetsManagerABI = optionalRequire('AssetsManager.json')
