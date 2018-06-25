import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'
import AccountSignatureModel from './AccountSignatureModel'

const schema = {
  key: PropTypes.string,
  name: PropTypes.string,
  types: PropTypes.object,
  encrypted: PropTypes.array,
  signature: PropTypes.instanceOf(AccountSignatureModel),
}

export default class AccountEntryModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, {
      key: '',
      name: '',
      types: {},
      encrypted: [],
      signature: {},
    }, props)
    Object.freeze(this)
  }
}
