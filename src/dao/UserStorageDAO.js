import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import IPFSDAO from './IPFSDAO'
import UserModel from '../models/UserModel'
import CBEModel from '../models/CBEModel'

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
            const user = new UserModel(data)
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

export default new UserStorageDAO(require('chronobank-smart-contracts/build/contracts/UserStorage.json'))
