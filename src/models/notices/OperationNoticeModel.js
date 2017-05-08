import { abstractNoticeModel } from './AbstractNoticeModel'
import { abstractModel } from '../AbstractModel'
import OperationModel from '../OperationModel'
import ProfileModel from '../ProfileModel'

class AuthorModel extends abstractModel() {
  address () {
    return this.get('address')
  }

  /** @return {ProfileModel } */
  profile () {
    return this.get('profile')
  }
}

class OperationNoticeModel extends abstractNoticeModel({
  operation: null,
  author: {
    address: null,
    profile: null
  },
  isRevoked: false
}) {
  constructor (data) {
    super({
      ...data,
      operation: data.operation instanceof OperationModel ? data.operation : new OperationModel(data.operation),
      author: new AuthorModel({
        address: data.author.address,
        profile: data.author.profile instanceof ProfileModel ? data.author.profile : new ProfileModel(data.author.profile)
      })
    })
  }

  /** @return {OperationModel} */
  operation () {
    return this.get('operation')
  }

  /** @return {AuthorModel} */
  author () {
    return this.get('author')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  message () {
    return 'Operation ' + (this.isRevoked() ? 'revoked' : 'confirmed')
  }
}

export default OperationNoticeModel
