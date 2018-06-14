import PropTypes from 'prop-types'

export default class AbstractWalletModel {
  constructor (props, schema) {
    PropTypes.checkPropTypes(schema, props, 'prop', '' + this.class)
    Object.assign(this, props)
  }
}
