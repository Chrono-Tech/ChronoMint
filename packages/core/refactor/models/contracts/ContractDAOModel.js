import PropTypes from 'prop-types'
import ContractModel from './ContractModel'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  contract: PropTypes.instanceOf(ContractModel).isRequired,
  address: PropTypes.string.isRequired,
  history: PropTypes.string,
  dao: PropTypes.any.isRequired,
})

export default class ContractDAOModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
