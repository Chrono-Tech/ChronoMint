/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type AbstractModel from '../models/AbstractModelOld'
import ProfileModel from '../models/ProfileModel'
import AbstractContractDAO from './AbstractContractDAO'
import { TX_ADD_CBE, TX_REVOKE_CBE } from './constants/UserManagerDAO'

export default class UserManagerDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(web3, options)
  }

  disconnect () {
    if (this.isConnected) {
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  isCBE (account): Promise<boolean> {
    return this.contract.methods.getCBE(account).call()
  }

  getMemberId (account) {
    return this.contract.methods.getMemberId(account).call()
  }

  async getMemberProfile (account): Promise<ProfileModel | AbstractModel> {
    const hash = await this.contract.methods.getMemberHash(account).call()
    const ipfsData = await this._ipfs(hash.toString())
    return new ProfileModel(ipfsData)
  }

  async _decodeArgs (func, args: Object) {
    let profile
    switch (func) {
      case TX_ADD_CBE:
        profile = new ProfileModel(await this._ipfs(args._hash))
        return {
          address: args._key,
          name: profile.name(),
        }
      case TX_REVOKE_CBE:
        profile = await this.getMemberProfile(args._key)
        return {
          address: args._key,
          name: profile.name(),
        }
      default:
        return args
    }
  }
}
