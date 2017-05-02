import CBENoticeModel from './CBENoticeModel'
import TokenContractNoticeModel from './TokenContractNoticeModel'
import LOCNoticeModel from './LOCNoticeModel'
import OtherContractNoticeModel from './OtherContractNoticeModel'
import TransferNoticeModel from './TransferNoticeModel'

// Important! To enable your notice model add it to the list below
const classes = {
  CBENoticeModel,
  TokenContractNoticeModel,
  LOCNoticeModel,
  OtherContractNoticeModel,
  TransferNoticeModel
}

export default (name, data) => new classes[name](data)
