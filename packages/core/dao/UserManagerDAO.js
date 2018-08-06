/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import type AbstractModel from '../models/AbstractModelOld'
import CBEModel from '../models/CBEModel'
import CBENoticeModel from '../models/notices/CBENoticeModel'
import ProfileModel from '../models/ProfileModel'
import AdditionalActionModel from '../models/AdditionalActionModel'
import ProfileNoticeModel from '../models/notices/ProfileNoticeModel'
import AbstractContractDAO from './AbstractContract3DAO'

//#region CONSTANTS

import {
  DEFAULT_TX_OPTIONS,
} from './constants'
import {
  TX_ADD_CBE,
  TX_REVOKE_CBE,
  TX_SET_MEMBER_HASH,
  TX_SET_OWN_HASH,
  TX_SET_REQUIRED_SIGNS,
} from './constants/UserManagerDAO'

//#endregion CONSTANTS

const EVENT_CBE_UPDATE = 'CBEUpdate'
const EVENT_PROFILE_UPDATE = 'SetHash'

export default class UserManagerDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.CBEUpdateEmitter = this.contract.events.CBEUpdate({})
      .on('data', this.handleCBEUpdateData.bind(this))
      .on('changed', this.handleCBEUpdateChanged.bind(this))
      .on('error', this.handleCBEUpdateError.bind(this))

    this.NewUserRegisteredEmitter = this.contract.events.NewUserRegistered({})
      .on('data', this.handleNewUserRegisteredData.bind(this))
      .on('changed', this.handleNewUserRegisteredChanged.bind(this))
      .on('error', this.handleNewUserRegisteredError.bind(this))
  }

  disconnect () {
    if (this.isConnected) {
      this.CBEUpdateEmitter.removeAllListeners()
      this.NewUserRegisteredEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  handleCBEUpdateData = (data) => {
    this.emit('CBEUpdate', data)
  }

  handleCBEUpdateChanged = (data) => {}

  handleCBEUpdateError = (data) => {
    this.emit('CBEUpdate_error', data)
  }

  handleNewUserRegisteredData = (data) => {
    this.emit('NewUserRegistered', data)
  }

  handleNewUserRegisteredChanged = (data) => {}

  handleNewUserRegisteredError = (data) => {
    this.emit('NewUserRegistered_error', data)
  }

  isCBE (account): Promise<boolean> {
    return this.contract.methods.getCBE(account).call()
  }

  async usersTotal () {
    const userCount = await this.contract.methods.userCount().call()
    return userCount - 1
  }

  getMemberId (account) {
    return this.contract.methods.getMemberId(account).call()
  }

  getSignsRequired () {
    return this.contract.methods.required().call()
  }

  getAdminCount () {
    return this.contract.methods.adminCount().call()
  }

  async getCBEList (): Immutable.Map<CBEModel> {
    const [ addresses, hashes ] = await this.contract.methods.getCBEMembers().call()
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
        promises.push(callback(addresses[ key ], hashes[ key ]))
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

  /**
   * @returns {Promise<[boolean,string]>} isNew & bytes32 profile IPFS hash
   * @private
   */
  async _saveMemberProfile (account, profile: ProfileModel | AbstractModel) {
    const current = await this.getMemberProfile(account)
    if (JSON.stringify(current.summary()) === JSON.stringify(profile.summary())) {
      return [ null, false ]
    }
    return [ await this._ipfsPut(profile.toJS()), true ]
  }

  _saveProfile (profile: ProfileModel | AbstractModel) {
    const action = async () => {
      const hash = await this._ipfsPut(profile.toJS())
      return {
        hash,
      }
    }
    return new AdditionalActionModel({
      action,
      errorMessage: 'tx.UserManager.errors.saveInIPFSError',
      repeatButtonName: 'tx.UserManager.errors.repeatButtonName',
    })
  }

  async setMemberProfile (account: string, profile: ProfileModel | AbstractModel, isOwn: boolean = true) {
    const current = await this.getMemberProfile(account)
    if (JSON.stringify(current.summary()) === JSON.stringify(profile.summary())) {
      return true
    }
    return isOwn
      ? this._tx(
        TX_SET_OWN_HASH,
        [],
        profile,
        new BigNumber(0),
        {
          ...DEFAULT_TX_OPTIONS,
          additionalAction: this._saveProfile(profile),
        })
      : this._tx(
        TX_SET_MEMBER_HASH,
        [
          account,
        ],
        {
          address: account,
          ...profile.txSummary(),
        },
        new BigNumber(0),
        {
          ...DEFAULT_TX_OPTIONS,
          additionalAction: this._saveProfile(profile),
        })
  }

  async addCBE (cbe: CBEModel) {
    if (await this.isCBE(cbe.address())) {
      return
    }

    const user = await this.getMemberProfile(cbe.address())
    const [ hash ] = await this._saveMemberProfile(cbe.address(), user.set('name', cbe.name()))

    return this._multisigTx(TX_ADD_CBE, [ cbe.address(), hash ], {
      address: cbe.address(),
      name: cbe.name(),
    })
  }

  revokeCBE (cbe: CBEModel) {
    return this._multisigTx(TX_REVOKE_CBE, [ cbe.address() ], {
      address: cbe.address(),
      name: cbe.name(),
    })
  }

  setRequired (n: number) {
    return this._multisigTx(TX_SET_REQUIRED_SIGNS, [ n ])
  }

  async watchProfile (callback) {
    return this.on(EVENT_PROFILE_UPDATE, async (result, block, time) => {
      const address = result.args.key
      const profile = await this.getMemberProfile(address)
      callback(new ProfileNoticeModel({
        time,
        profile,
      }))
    })
  }

  async watchCBE (callback) {
    return this.on(EVENT_CBE_UPDATE, async (result, block, time) => {
      const address = result.args.key
      const isNotRevoked = await this.isCBE(address)
      const user = await this.getMemberProfile(address)
      callback(new CBENoticeModel({
        time,
        cbe: new CBEModel({
          address,
          user,
          name: user.name(),
        }),
        isRevoked: !isNotRevoked,
      }))
    })
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
