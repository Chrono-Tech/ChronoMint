import PropTypes from 'prop-types'

export default class AbstractModel {
  constructor (props, schema) {
    PropTypes.checkPropTypes(schema, props, 'prop', '' + this.class)
    Object.assign(this, props)
  }
}
