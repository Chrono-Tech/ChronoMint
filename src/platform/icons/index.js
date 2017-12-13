import React from 'react'

const Icons = {
  get (name) {
    switch (name) {
      case 'notices.arbitrary.icon':
        return <i className='material-icons'>error_outline</i>
      case 'notices.approval.icon':
        return <i className='material-icons'>account_balance_wallet</i>
      case 'notices.settings.icon':
        return <i className='material-icons'>settings</i>
      case 'notices.locs.icon':
      case 'notices.wallet.icon':
        return <i className='material-icons'>group</i>
      case 'notices.operations.icon':
        return <i className='material-icons'>alarm</i>
      case 'notices.polls.icon':
        return <i className='material-icons'>poll</i>
      case 'notices.transfer.icon':
        return <i className='material-icons'>alarm</i>

      case 'notices.operations.icon':
        return <i className='material-icons'>alarm</i>
    }
  },
}

export {
  Icons,
}
