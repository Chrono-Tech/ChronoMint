import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'

const schema = {
  id: PropTypes.string,
  avatar: PropTypes.string,
  ipfs: PropTypes.string,
}

export default class AccountEntryModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, {
      id: '',
      avatar: '',
      ipfs: '',
    }, props)
    Object.freeze(this)
  }
}
