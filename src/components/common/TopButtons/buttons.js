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
  '/deposit': {
    title: 'nav.deposit',
    backButton: true,
  },
  '/wallets': {
    title: 'nav.wallets',
  },
  '/wallet': {
    title: 'nav.wallet',
    backButton: true,
  },
}
