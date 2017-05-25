import CBENoticeModel from './CBENoticeModel'
import TokenContractNoticeModel from './TokenContractNoticeModel'
import LOCNoticeModel from './LOCNoticeModel'
import OtherContractNoticeModel from './OtherContractNoticeModel'
import TransferNoticeModel from './TransferNoticeModel'
import OperationNoticeModel from './OperationNoticeModel'

// Important! To enable your notice model add it to the list below
const classes = {
  CBENoticeModel,
  TokenContractNoticeModel,
  LOCNoticeModel,
  OtherContractNoticeModel,
  TransferNoticeModel,
  OperationNoticeModel
}

export default (name, data) => new classes[name](data)
