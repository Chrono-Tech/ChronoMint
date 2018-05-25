/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const prefix = 'TwoFaWalletForm'

export default {
  en: {
    title: 'Set transaction fee',
    description: `Enabling 2FA option for your account requires transaction to be completed. Set the transaction fee and click proceed.`,
    proceed: 'proceed',
    slow: 'Slow transaction',
    fast: 'Fast',
    transactionFee: 'Transaction fee:',
    averageFee: '%{multiplier}x of average fee',
    waitTitle: 'We are enabling 2fa for your account',
    waitDescription: 'This process may take more than 30 seconds. You can leave the page and we will send you a notification once the process is completed.',
    goToMyWallets: 'go to my wallets',
    successTitle: '2FA option has been enabled!',
    successDescription: 'Click Proceed button to finalize setup.',
  },
}
