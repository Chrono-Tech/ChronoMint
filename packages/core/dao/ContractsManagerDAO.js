/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from '../models/validator'
import { ContractsManagerABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'
import ChronoBankAssetProxyDAO from './ChronoBankAssetProxyDAO'
import PendingManagerDAO from './PendingManagerDAO'
import RewardsDAO from './RewardsDAO'
import UserManagerDAO from './UserManagerDAO'

const DAO_PENDING_MANAGER = 'PendingManager'
const DAO_REWARDS = 'Rewards'
const DAO_CHRONOBANK_ASSET_PROXY = 'ChronoBankAssetProxyDAO'
const DAO_USER_MANAGER = 'UserManager'

const daoMap = {
  [DAO_USER_MANAGER]: UserManagerDAO,
  [DAO_PENDING_MANAGER]: PendingManagerDAO,
  [DAO_REWARDS]: RewardsDAO,
  [DAO_CHRONOBANK_ASSET_PROXY]: ChronoBankAssetProxyDAO,
}

class ContractsManagerDAO extends AbstractContractDAO {
  _contracts = {}

  getContractAddressByType (type: string) {
    return this._call('getContractAddressByType', [type])
  }

  /** @private */
  async _getDAO (daoType: string, account = null, isNew = false): Promise<AbstractContractDAO> {
    let accountParam = account
    if (!daoMap.hasOwnProperty(daoType)) {
      // return
      throw new Error(`invalid DAO type ${daoType}`)
    }

    accountParam = accountParam || await this.getContractAddressByType(daoType)

    const key = `${accountParam}-${daoType}`
    if (this._contracts.hasOwnProperty(key)) {
      return this._contracts[key]
    }

    const DAOClass = daoMap[daoType]
    const dao = new DAOClass(accountParam)

    if (isNew) {
      const isDeployed = await dao.isDeployed()
      if (!isDeployed) {
        throw new Error(`Can't init ${DAOClass.name} at ${accountParam}`)
      }
    }

    this._contracts[key] = dao
    return dao
  }

  getUserManagerDAO (): Promise<UserManagerDAO> {
    return this._getDAO(DAO_USER_MANAGER)
  }

  getRewardsDAO (): Promise<RewardsDAO> {
    return this._getDAO(DAO_REWARDS)
  }

  getPendingManagerDAO (): Promise<PendingManagerDAO> {
    return this._getDAO(DAO_PENDING_MANAGER)
  }

  async isContract (account): Promise<boolean> {
    return validator.address(account) === null
      ? await this.getCode(account) !== null
      : false
  }

  subscribeOnReset () {
    this._web3Provider.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset () {
    this._contracts = {}
    if (this.contract) {
      this.contract = this._initContract()
    }
  }
}

export default new ContractsManagerDAO(ContractsManagerABI)
