import {abstractNoticeModel} from './AbstractNoticeModel'
import TokenContractModel from '../contracts/TokenContractModel'

class TokenContractNoticeModel extends abstractNoticeModel({
  token: null,
  isRevoked: false
}) {
  constructor (data) {
    super({
      ...data,
      token: data.token instanceof TokenContractModel ? data.token : new TokenContractModel(data.token)
    })
  }

  /** @return {TokenContractModel} */
  token () {
    return this.get('token')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  message () {
    return 'Token ' + this.token().symbol() + ' contract was ' + (this.isRevoked() ? 'revoked' : 'added') + '.'
  };
}

export default TokenContractNoticeModel
