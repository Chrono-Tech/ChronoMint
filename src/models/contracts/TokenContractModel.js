import DAOFactory from '../../dao/DAOFactory'
import { abstractContractModel } from './AbstractContractModel'
import validator from '../../components/forms/validator'
import ErrorList from '../../components/forms/ErrorList'

class TokenContractModel extends abstractContractModel({
  proxy: null,
  symbol: null,
  totalSupply: null
}) {
  proxy () {
    return DAOFactory.initProxyDAO(this.get('proxy'))
  }

  proxyAddress () {
    return this.get('proxy')
  }

  symbol () {
    return this.get('symbol')
  }

  totalSupply () {
    return this.get('totalSupply')
  }
}

export const validate = values => {
  const errors = {}
  errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
  return errors
}

export default TokenContractModel
