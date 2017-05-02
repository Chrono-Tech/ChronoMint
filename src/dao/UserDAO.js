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
        IPFSDAO.get(this._bytes32ToIPFSHash(result)).then(data => {
          resolve(new ProfileModel(data))
        })
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
    return this.getMemberProfile(account).then(currentProfile => {
      if (JSON.stringify(currentProfile.toJS()) === JSON.stringify(profile.toJS())) {
        return true
      }
      return IPFSDAO.put(profile.toJS()).then(hash => {
        const value = this._IPFSHashToBytes32(hash)
        return own
          ? this._tx('setOwnHash', [value])
          : this._tx('setMemberHash', [account, value])
      })
    })
  }

  /**
   * @param cbe
   * @return {Promise.<bool>} result
   */
  treatCBE (cbe: CBEModel) {
    const updateProfile = new Promise((resolve, reject) => {
      this.getMemberProfile(cbe.address()).then(user => {
        if (cbe.name() === user.name()) {
          resolve(cbe)
        }
        user = user.set('name', cbe.name())
        this.setMemberProfile(cbe.address(), user, false).then(() => {
          resolve(cbe.set('user', user))
        }).catch(e => {
          reject(e)
        })
      })
    })
    return updateProfile.then(cbe => {
      return this.isCBE(cbe.address()).then(isCBE => {
        return isCBE ? cbe : this._tx('addKey', [cbe.address()])
      })
    })
  }

  /**
   * @param cbe
   * @return {Promise.<bool>} result
   */
  revokeCBE (cbe: CBEModel) {
    return this._tx('revokeKey', [cbe.address()])
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
