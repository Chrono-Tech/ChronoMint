import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'

const schema = {
  key: PropTypes.string,
  name: PropTypes.string,
  types: PropTypes.object,
  encrypted: PropTypes.array,
}

export default class WalletEntryModel extends AbstractModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, {
      key: '',
      name: '',
      types: {},
    }, props)
    Object.freeze(this)
  }
}
