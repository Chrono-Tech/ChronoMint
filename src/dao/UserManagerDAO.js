import Immutable from 'immutable'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import CBEModel from '../models/CBEModel'
import CBENoticeModel from '../models/notices/CBENoticeModel'
import ProfileModel from '../models/ProfileModel'

export const TX_ADD_CBE = 'addCBE'
export const TX_REVOKE_CBE = 'revokeCBE'
export const TX_SET_REQUIRED_SIGNS = 'setRequired'
export const TX_SET_OWN_HASH = 'setOwnHash'
export const TX_SET_MEMBER_HASH = 'setMemberHash'

export default class UserManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/UserManager.json'), at)
  }

  /**
   * @param account
   * @param block
   * @returns {Promise.<bool>}
   */
  isCBE (account: string, block) {
    return this._call('getCBE', [account], block)
  }

  usersTotal () {
    return this._callNum('userCount').then(r => r - 1)
  }

  getMemberId (account: string) {
    return this._callNum('getMemberId', [account])
  }

  getSignsRequired () {
    return this._callNum('required')
  }

  getAdminCount () {
    return this._callNum('adminCount')
  }

  /** @returns {Promise.<Immutable.Map[string,CBEModel]>} associated with CBE address */
  async getCBEList () {
    const [addresses, hashes] = await this._call('getCBEMembers')
    let map = new Immutable.Map()

    const callback = async (address, hash) => {
      const user = new ProfileModel(await this._ipfs(hash))
      map = map.set(address, new CBEModel({
        address: address,
        name: user.name(),
        user
      }))
    }

    const promises = []
    for (let key in addresses) {
      if (addresses.hasOwnProperty(key)) {
        promises.push(callback(addresses[key], hashes[key]))
      }
    }
    await Promise.all(promises)

    return map
  }

  /**
   * @param account for which you want to get profile
   * @param block
   * @returns {Promise.<ProfileModel>}
   */
  async getMemberProfile (account: string, block) {
    const hash = await this._call('getMemberHash', [account], block)

    return new ProfileModel(await this._ipfs(hash))
  }

  /**
   * @param account
   * @param profile
   * @returns {Promise.<[boolean,string]>} isNew & bytes32 profile IPFS hash
   * @private
   */
  async _saveMemberProfile (account: string, profile: ProfileModel) {
    const current = await this.getMemberProfile(account)
    if (JSON.stringify(current.toJS()) === JSON.stringify(profile.toJS())) {
      return [null, false]
    }
    return [await this._ipfsPut(profile.toJS()), true]
  }

  /**
   * @param account
   * @param profile
   * @param own true to change own profile, false to change foreign profile
   * @returns {Promise.<bool>}
   */
  async setMemberProfile (account: string, profile: ProfileModel, own: boolean = true) {
    const [hash, isNew] = await this._saveMemberProfile(account, profile)
    if (!isNew) {
      return true
    }
    return own
      ? this._tx(TX_SET_OWN_HASH, [hash], profile.toJS())
      : this._tx(TX_SET_MEMBER_HASH, [account, hash], {address: account, ...profile.toJS()})
  }

  /**
   * @param cbe
   * @returns {Promise.<bool>} result
   */
  async saveCBE (cbe: CBEModel) {
    const user = await this.getMemberProfile(cbe.address())
    const [hash] = await this._saveMemberProfile(cbe.address(), user.set('name', cbe.name()))
    const isCBE = await this.isCBE(cbe.address())

    if (isCBE) {
      return cbe
    }

    return this._tx(TX_ADD_CBE, [cbe.address(), hash], {
      address: cbe.address(),
      name: cbe.name()
    })
  }

  /**
   * @param cbe
   * @returns {Promise.<bool>} result
   */
  revokeCBE (cbe: CBEModel) {
    return this._tx(TX_REVOKE_CBE, [cbe.address()], {
      address: cbe.address(),
      name: cbe.name()
    })
  }

  /**
   * @param n
   * @returns {Promise.<bool>} result
   */
  setRequired (n: number) {
    return this._tx(TX_SET_REQUIRED_SIGNS, [n])
  }

  /**
   * @param callback will receive...
   * @see CBENoticeModel with updated/revoked element and isOld flag
   */
  async watchCBE (callback) {
    return this.watch('CBEUpdate', async (result, block, time, isOld) => {
      const address = result.args.key
      const isNotRevoked = await this.isCBE(address, block)
      const user = await this.getMemberProfile(address, block)
      callback(new CBENoticeModel({
        time,
        cbe: new CBEModel({
          address,
          user,
          name: user.name()
        }),
        isRevoked: !isNotRevoked
      }), isOld)
    })
  }

  async _decodeArgs (func, args) {
    let profile
    switch (func) {
      case TX_ADD_CBE:
        profile = new ProfileModel(await this._ipfs(args._hash))
        return {
          address: args._key,
          name: profile.name()
        }
        break
      case TX_REVOKE_CBE:
        profile = await this.getMemberProfile(args._key)
        return {
          address: args._key,
          name: profile.name()
        }
        break

      default:
        return args
    }
  }

  _multisigFuncs () {
    return {
      [TX_ADD_CBE]: ['address', true],
      [TX_REVOKE_CBE]: ['address', false]
    }
  }
}
