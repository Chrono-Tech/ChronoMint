import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import CBEModel from '../models/CBEModel'
import ProfileModel from '../models/ProfileModel'

class UserStorageDAO extends AbstractContractDAO { // TODO move methods from this class to UserManager when contracts will be updated
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

  /** @returns {Promise.<Map[string,CBEModel]>} associated with CBE account address */
  getCBEList () {
    return new Promise(resolve => {
      this._call('getCBEMembers').then(([addresses, hashes]) => {
        let map = new Map()
        const callback = (address, hash) => {
          this._ipfs(hash).then(data => {
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
            callback(addresses[key], hashes[key])
          }
        }
      })
    })
  }
}

export default new UserStorageDAO(require('chronobank-smart-contracts/build/contracts/UserStorage.json'))
