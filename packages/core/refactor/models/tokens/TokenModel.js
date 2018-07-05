import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  key: PropTypes.string.isRequired,
  name: PropTypes.string,
  symbol: PropTypes.string,
  address: PropTypes.string,
  decimals: PropTypes.number,
})

export default class TokenModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
