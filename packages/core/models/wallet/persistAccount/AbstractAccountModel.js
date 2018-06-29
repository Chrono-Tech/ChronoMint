import PropTypes from 'prop-types'

class AbstractAccountModel {
  constructor(props, schema){
    PropTypes.checkPropTypes(schema, props, 'prop', '' + this.class)
    Object.assign(this, props)
  }
}

export default AbstractAccountModel
