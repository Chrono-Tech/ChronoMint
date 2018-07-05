import PropTypes from 'prop-types'
import { ProfileModel } from 'src/models'
import AbstractModel from '../AbstractModel'

const schema = {
  address: PropTypes.string.isRequired,
  sign: PropTypes.func.isRequired,
  signTransaction: PropTypes.func.isRequired,
  profile: PropTypes.instanceOf(ProfileModel),
}

export default class SignerModel extends AbstractModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
