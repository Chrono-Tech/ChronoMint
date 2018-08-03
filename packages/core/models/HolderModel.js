import PropTypes from 'prop-types'
import AbstractModel from './AbstractModel'

const schemaFactory = () => ({
  value: PropTypes.any,
})

export default class HolderModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
