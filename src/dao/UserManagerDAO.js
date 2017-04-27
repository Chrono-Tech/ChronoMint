import AbstractContractDAO from './AbstractContractDAO'
import IPFSDAO from './IPFSDAO'
import UserStorageDAO from './UserStorageDAO'
import CBEModel from '../models/CBEModel'
import CBENoticeModel from '../models/notices/CBENoticeModel'
import UserModel from '../models/UserModel'

class UserManagerDAO extends AbstractContractDAO {
  /**
   * @param account for which you want to get profile
   * @param block
   * @return {Promise.<UserModel>}
   */
  getMemberProfile (account: string, block) {
    return new Promise(resolve => {
      this._call('getMemberHash', [account], block).then(result => {
        IPFSDAO.get(this._bytes32ToIPFSHash(result)).then(data => {
          resolve(new UserModel(data))
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
  setMemberProfile (account: string, profile: UserModel, own: boolean = true) {
    return this.getMemberProfile(account).then(currentProfile => {
      if (JSON.stringify(currentProfile.toJS()) === JSON.stringify(profile.toJS())) {
        return true
      }
      return IPFSDAO.put(profile.toJS()).then(value => {
        const hash = this._IPFSHashToBytes32(value)
        return this._tx(own ? 'setOwnHash' : 'setMemberHash', own ? [hash] : [account, hash])
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
      return UserStorageDAO.isCBE(cbe.address()).then(isCBE => {
        return isCBE ? cbe : this._tx('addKey', [cbe.address()])
      })
    })
  }

  /**
   * @param cbe
   * @return {Promise.<bool>} result
   */
  revokeCBE (cbe: CBEModel) {
    return this._tx('revokeKey', [cbe.address])
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
      UserStorageDAO.isCBE(address, block).then(isNotRevoked => {
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

export default new UserManagerDAO(require('chronobank-smart-contracts/build/contracts/UserManager.json'))
