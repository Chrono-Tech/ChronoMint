/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import type AbstractModel from '../models/AbstractModelOld'
import CBEModel from '../models/CBEModel'
import ProfileModel from '../models/ProfileModel'
import AbstractContractDAO from './AbstractContract3DAO'
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

  async getCBEList (): Immutable.Map<CBEModel> {
    const result = await this.contract.methods.getCBEMembers().call()
    const [addresses, hashes] = Object.values(result)
    let map = new Immutable.Map()

    const callback = async (address, hash) => {
      const user = new ProfileModel(await this._ipfs(hash))
      const cbe = new CBEModel({
        address,
        name: user.name(),
        user,
      })
      map = map.set(cbe.id(), cbe)
    }

    const promises = []
    for (const key in addresses) {
      if (addresses.hasOwnProperty(key)) {
        promises.push(callback(addresses[key], hashes[key]))
      }
    }
    await Promise.all(promises)

    return map
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
