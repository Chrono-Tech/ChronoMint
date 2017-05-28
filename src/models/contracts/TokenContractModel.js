import DAOFactory from '../../dao/DAOFactory'
import { abstractContractModel } from './AbstractContractModel'

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

export const validateRules = {
  address: 'required|ethereum-address'
}

export default TokenContractModel
