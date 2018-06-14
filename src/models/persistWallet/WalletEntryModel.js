import PropTypes from 'prop-types'
import AbstractWalletModel from './AbstractWalletModel'

const schema = {
  key: PropTypes.string,
  name: PropTypes.string,
  types: PropTypes.object,
  encrypted: PropTypes.array,
}

export default class WalletEntryModel extends AbstractWalletModel {
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
