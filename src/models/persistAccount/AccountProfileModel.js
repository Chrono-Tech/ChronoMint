import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'

const schema = {
  id: PropTypes.string,
  avatar: PropTypes.string,
  address: PropTypes.string,
  ipfsHash: PropTypes.string,
  userName: PropTypes.string,
}

export default class AccountProfileModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, {
      id: '',
      avatar: '',
      address: '',
      ipfsHash: '',
      userName: '',
    }, props)
    Object.freeze(this)
  }
}
