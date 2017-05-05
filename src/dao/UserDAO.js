import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import IPFSDAO from './IPFSDAO'
import CBEModel from '../models/CBEModel'
import CBENoticeModel from '../models/notices/CBENoticeModel'
import ProfileModel from '../models/ProfileModel'

class UserStorageDAO extends AbstractContractDAO {
  /**
   * @param account
   * @param block
   * @return {Promise.<bool>}
   */
  isCBE (account: string, block) {
    return this._call('getCBE', [account], block)
  }

  usersTotal () {
    return this._call('userCount').then(r => r.toNumber() - 1)
  }

  /** @return {Promise.<Map[string,CBEModel]>} associated with CBE account address */
  getCBEList () {
    return new Promise(resolve => {
      this._call('getCBEMembers').then(result => {
        const addresses = result[0]
        const hashes = result[1]
        let map = new Map()
        const callback = (address, hash) => {
          IPFSDAO.get(hash).then(data => {
            const user = new ProfileModel(data)
            map = map.set(address, new CBEModel({
              address: address,
              name: user.name(),
              user
            }))
            if (map.size === addresses.length) {
              resolve(map)
            }
          })
        }
        for (let key in addresses) {
          if (addresses.hasOwnProperty(key) && hashes.hasOwnProperty(key)) {
            callback(
              addresses[key],
              this._bytes32ToIPFSHash(hashes[key])
            )
          }
        }
      })
    })
  }
}
const storage = new UserStorageDAO(require('chronobank-smart-contracts/build/contracts/UserStorage.json'))

class UserDAO extends AbstractContractDAO {
  isCBE (account: string, block) {
    return storage.isCBE(account, block)
  }

  usersTotal () {
    return storage.usersTotal()
  }

  getCBEList () {
    return storage.getCBEList()
  }

  /**
   * @param account for which you want to get profile
   * @param block
   * @return {Promise.<ProfileModel>}
   */
  getMemberProfile (account: string, block) {
    return new Promise(resolve => {
      this._call('getMemberHash', [account], block).then(result => {
        const hash = this._bytes32ToIPFSHash(result)
        IPFSDAO.get(hash).then(data => {
          resolve(new ProfileModel(data))
        })
      })
    })
  }

  /**
   * @param account
   * @param profile
   * @returns {Promise.<[boolean,string]>} isNew & bytes32 profile IPFS hash
   * @private
   */
  _saveMemberProfile (account: string, profile: ProfileModel) {
    return this.getMemberProfile(account).then(current => {
      if (JSON.stringify(current.toJS()) === JSON.stringify(profile.toJS())) {
        return [null, false]
      }
      return IPFSDAO.put(profile.toJS()).then(hash => {
        return [this._IPFSHashToBytes32(hash), true]
      })
    })
  }

  /**
   * @param account
   * @param profile
   * @param own true to change own profile, false to change foreign profile
   * @return {Promise.<bool>}
   */
  setMemberProfile (account: string, profile: ProfileModel, own: boolean = true) {
    return this._saveMemberProfile(account, profile).then(([hash, isNew]) => {
      if (!isNew) {
        return true
      }
      return own
        ? this._tx('setOwnHash', [hash])
        : this._tx('setMemberHash', [account, hash])
    })
  }

  /**
   * @param cbe
   * @return {Promise.<bool>} result
   */
  treatCBE (cbe: CBEModel) {
    return this.getMemberProfile(cbe.address()).then(user => {
      return this._saveMemberProfile(cbe.address(), user.set('name', cbe.name())).then(([hash, isNewHash]) => {
        return this.isCBE(cbe.address()).then(isCBE => {
          return isCBE && !isNewHash ? cbe : this._tx('addCBE', [cbe.address(), hash])
        })
      })
    })
  }

  /**
   * @param cbe
   * @return {Promise.<bool>} result
   */
  revokeCBE (cbe: CBEModel) {
    return this._tx('revokeCBE', [cbe.address()])
  }

  /**
   * @param callback will receive CBENoticeModel and isOld flag
   * @see CBENoticeModel with updated/revoked element
   * @param account from
   */
  watchCBE (callback, account: string) {
    return this._watch('cbeUpdate', (result, block, time, isOld) => {
      const address = result.args.key
      if (address === account) {
        return
      }
      this.isCBE(address, block).then(isNotRevoked => {
        this.getMemberProfile(address, block).then(user => {
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
      })
    })
  }
}

export default new UserDAO(require('chronobank-smart-contracts/build/contracts/UserManager.json'))
