import PropTypes from 'prop-types'
import AbstractTokenDAO from 'packages/core/refactor/daos/lib/AbstractTokenDAO'
import ETHTokenDAO from 'packages/core/refactor/daos/lib/ETHTokenDAO'
import ERC20TokenDAO from 'packages/core/refactor/daos/lib/ERC20TokenDAO'
import AbstractModel from '../AbstractModel'
import TokenModel from './TokenModel'

const schemaFactory = () => ({
  token: PropTypes.instanceOf(TokenModel),
  dao: PropTypes.instanceOf(AbstractTokenDAO),
})

export default class TokenDAOModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get key () {
    return this.token.key
  }

  static fromTokenModel (token, { getAbi }) {
    if (token.address == null) {
      return new TokenDAOModel({
        token,
        dao: new ETHTokenDAO(token),
      })
    }
    const abi = getAbi(token.address)
    return new TokenDAOModel({
      token,
      dao: new ERC20TokenDAO(token, abi),
    })
  }
}
