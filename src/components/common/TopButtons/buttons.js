import { modalsOpen } from 'redux/modals/actions'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'

export default {
  '/deposits': {
    buttons: [
      {
        title: 'addDeposit',
        action: () => modalsOpen({ component: DepositTokensModal }),
      },
    ],
  },
}
