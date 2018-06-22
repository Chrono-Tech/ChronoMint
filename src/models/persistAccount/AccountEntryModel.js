import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'

const schema = {
  key: PropTypes.string,
  name: PropTypes.string,
  types: PropTypes.object,
  encrypted: PropTypes.array,
}

export default class AccountEntryModel extends AbstractAccountModel {
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
