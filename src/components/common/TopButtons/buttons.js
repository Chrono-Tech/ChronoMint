import { modalsOpen } from 'redux/modals/actions'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'
import { push } from 'react-router-redux'
import WalletAddEditDialog from 'components/dialogs/wallet/WalletAddDialog/WalletAddDialog'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'

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
    buttons: [
      {
        title: 'addWallet',
        action: () => push('/add-wallet'),
      },
    ],
  },
  '/wallet': {
    title: 'nav.wallet',
    backButton: true,
  },
  '/add-wallet': {
    title: 'nav.addWallet',
    backButton: true,
    buttons: [
      {
        title: 'addWallet',
        action: () => modalsOpen({
          component: WalletAddEditDialog,
          props: { wallet: new MultisigWalletModel() },
        }),
      },
    ],
  },
}
