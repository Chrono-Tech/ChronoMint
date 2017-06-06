import CBENoticeModel from './CBENoticeModel'
import LOCNoticeModel from './LOCNoticeModel'
import TransferNoticeModel from './TransferNoticeModel'
import OperationNoticeModel from './OperationNoticeModel'

// Important! To enable your notice model add it to the list below
const classes = {
  CBENoticeModel,
  LOCNoticeModel,
  TransferNoticeModel,
  OperationNoticeModel
}

export default (name, data) => new classes[name](data)
