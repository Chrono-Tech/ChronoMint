/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { modalsOpen } from 'redux/modals/actions'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'
import { push } from 'react-router-redux'
import { goBackForAddWalletsForm } from 'redux/mainWallet/actions'
import { changeWalletView } from 'redux/ui/actions'

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
        chronobankIcon: 'list',
        action: () => changeWalletView(),
      },
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
    backButtonAction: () => goBackForAddWalletsForm(),
  },
  '/2fa': {
    title: 'nav.twoFa',
    backButton: true,
  },
}
