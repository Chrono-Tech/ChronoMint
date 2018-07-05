import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'
import TokenDAOModel from './TokenDAOModel'

const schemaFactory = () => ({
  token: PropTypes.instanceOf(TokenDAOModel).isRequired,
  address: PropTypes.string.isRequired,
})

export default class PocketModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get key () {
    return `[token:${this.token.token.key}]-[account:${this.address.toLowerCase()}]`
  }
}
