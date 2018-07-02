import PropTypes from 'prop-types'
import AbstractModel from './AbstractJsModel'

const schemaFactory = () => ({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  hash: PropTypes.number.isRequired,
  date: PropTypes.instanceOf(Date),
  details: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any, // used Value component to render
  })),
})

export default class CurrentTransactionNotificationModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
