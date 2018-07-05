import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'

import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  name: PropTypes.string,
  value: PropTypes.instanceOf(BigNumber),
})

export default class CurrencyModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.freeze(this)
  }
}
