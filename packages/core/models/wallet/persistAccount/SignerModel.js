import PropTypes from 'prop-types'
import AbstractModel from '../../AbstractModel'

export default class SignerModel extends AbstractModel {
  constructor (props) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
