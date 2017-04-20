import AbstractNoticeModel from './AbstractNoticeModel'

class TransactionNoticeModel extends AbstractNoticeModel {
  message () {
    return 'Transaction is processing'
  };
}

export default TransactionNoticeModel
