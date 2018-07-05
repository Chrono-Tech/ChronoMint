import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  type: PropTypes.string.isRequired,
  address: PropTypes.string,
  history: PropTypes.string,
  abi: PropTypes.object.isRequired,
  DAOClass: PropTypes.any,
})

export default class ContractModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  create (address = null, history = null) {
    return new this.DAOClass({
      address: address || this.address,
      history: history || this.history,
      abi: this.abi,
    })
  }
}
