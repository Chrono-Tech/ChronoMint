import React from 'react'

export default (name) => {
  switch (name) {
    case 'ApprovalNoticeModel':
      return <i className='material-icons'>account_balance_wallet</i>
    case 'CBENoticeModel':
      return <i className='material-icons'>settings</i>
    case 'LOCNoticeModel':
      return <i className='material-icons'>group</i>
    case 'OperationNoticeModel':
      return <i className='material-icons'>alarm</i>
    case 'PollNoticeModel':
      return <i className='material-icons'>poll</i>
    case 'TokenNoticeModel':
      return <i className='material-icons'>settings</i>
    case 'TransferNoticeModel':
      return <i className='material-icons'>account_balance_wallet</i>
    case 'WalletNoticeModel':
      return <i className='material-icons'>group</i>
    case 'AbstractNoticeModel':
    default:
      return <i className='material-icons'>error_outline</i>
  }
}
