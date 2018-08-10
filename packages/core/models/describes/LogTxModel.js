import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'
import Amount from '../Amount'

const schemaFactory = () => ({
  key: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  category: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  amountTitle: PropTypes.string,
  isAmountSigned: PropTypes.bool,
  amount: PropTypes.instanceOf(Amount),
  target: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    description: PropTypes.string,
  })),
})

export default class LogTxModel extends AbstractModel {
  constructor (data) {
    super(data, schemaFactory())
    Object.freeze(this)
  }
}
