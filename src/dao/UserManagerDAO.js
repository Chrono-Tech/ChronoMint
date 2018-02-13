import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import type AbstractModel from 'models/AbstractModel'
import CBEModel from 'models/CBEModel'
import CBENoticeModel from 'models/notices/CBENoticeModel'
import ProfileModel from 'models/ProfileModel'
import { MultiEventsHistoryABI, UserManagerABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import { DEFAULT_TX_OPTIONS } from './AbstractContractDAO'
import AdditionalActionModel from '../models/AdditionalActionModel'

export const TX_ADD_CBE = 'addCBE'
export const TX_REVOKE_CBE = 'revokeCBE'
export const TX_SET_REQUIRED_SIGNS = 'setRequired'
export const TX_SET_OWN_HASH = 'setOwnHash'
export const TX_SET_MEMBER_HASH = 'setMemberHash'

const EVENT_CBE_UPDATE = 'CBEUpdate'

export default class UserManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(UserManagerABI, at, MultiEventsHistoryABI)
  }

  isCBE (account): Promise<boolean> {
    return this._call('getCBE', [ account ])
  }

  usersTotal () {
    return this._callNum('userCount').then((r) => r - 1)
  }

  getMemberId (account) {
    return this._callNum('getMemberId', [ account ])
  }

  getSignsRequired () {
    return this._callNum('required')
  }

  getAdminCount () {
    return this._callNum('adminCount')
  }

  async getCBEList (): Immutable.Map<CBEModel> {
    const [ addresses, hashes ] = await this._call('getCBEMembers')
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
    const hash = await this._call('getMemberHash', [ account ])
    return new ProfileModel(await this._ipfs(hash))
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

  async watchCBE (callback) {
    return this._watch(EVENT_CBE_UPDATE, async (result, block, time) => {
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
