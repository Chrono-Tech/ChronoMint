import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'
import AccountProfileModel from './AccountProfileModel'

const schema = {
  key: PropTypes.string,
  name: PropTypes.string,
  types: PropTypes.object,
  encrypted: PropTypes.array,
  profile: PropTypes.instanceOf(AccountProfileModel),
}

class AccountEntryModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, {
      key: '',
      name: '',
      types: {},
      encrypted: [],
      profile: new AccountProfileModel(),
    }, props)
    Object.freeze(this)
  }
}

export default AccountEntryModel
