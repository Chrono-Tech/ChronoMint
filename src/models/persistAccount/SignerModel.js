import PropTypes from 'prop-types'
import AbstractWalletModel from './AbstractWalletModel'

const schema = {
  address: PropTypes.string.isRequired,
  sign: PropTypes.func.isRequired,
  signTransaction: PropTypes.func.isRequired,
}

export default class SignerModel extends AbstractWalletModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
