import { abstractNoticeModel } from './AbstractNoticeModel'
import AbstractOtherContractModel from '../contracts/AbstractOtherContractModel'
import ContractsManagerDAO from '../../dao/ContractsManagerDAO'

class OtherContractNoticeModel extends abstractNoticeModel({
  contract: null,
  isRevoked: false,
  type: null
}) {
  constructor (data) {
    const types = ContractsManagerDAO.getOtherDAOsTypes()
    const isNew = data.contract instanceof AbstractOtherContractModel
    if (isNew) {
      // define type by contract model instance
      for (let key in types) {
        if (types.hasOwnProperty(key)) {
          if (data.contract instanceof ContractsManagerDAO.getDAOs()[types[key]].getContractModel()) {
            data.type = types[key]
          }
        }
      }
    }
    if (!data.hasOwnProperty('type') || !types.includes(data.type)) {
      throw new TypeError('invalid type')
    }
    const Model = ContractsManagerDAO.getDAOs()[data.type].getContractModel()
    super({
      ...data,
      contract: isNew ? data.contract : new Model(data.contract.address, data.contract.id)
    })
  }

  /** @returns {AbstractOtherContractModel} */
  contract () {
    return this.get('contract')
  }

  isRevoked () {
    return this.get('isRevoked')
  }

  message () {
    return this.contract().name() + ' contract was ' + (this.isRevoked() ? 'revoked' : 'added') + '.'
  }
}

export default OtherContractNoticeModel
