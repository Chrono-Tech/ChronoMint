import { abstractNoticeModel } from './AbstractNoticeModel'
import OperationModel from '../OperationModel'

class OperationNoticeModel extends abstractNoticeModel({
  operation: null,
  isRevoked: false
}) {
  constructor (data) {
    super({
      ...data,
      operation: data.operation instanceof OperationModel ? data.operation : new OperationModel(data.operation)
    })
  }

  /** @return {OperationModel} */
  operation () {
    return this.get('operation')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  message () {
    return 'Operation ' + (this.isRevoked() ? 'revoked' : 'confirmed')
  }
}

export default OperationNoticeModel
