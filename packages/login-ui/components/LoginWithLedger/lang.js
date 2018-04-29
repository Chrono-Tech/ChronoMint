/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const en = {
  login: 'Login',
  ethAddress: 'Ethereum address',
  isHttps: {
    successTitle: 'HTTPS protocol provided',
    errorTitle: 'HTTPS protocol only',
    errorTip: 'Ledger works over HTTPS protocol only',
  },
  isU2F: {
    successTitle: 'U2F supported',
    errorTitle: 'U2F is not supported',
    errorTip: 'LedgerWallet uses U2F which is not supported by your browser. Use Chrome, Opera or Firefox with a U2F extension.',
  },
  isETHAppOpened: {
    successTitle: 'Ethereum application found successfully',
    errorTitle: 'Ethereum application is not opened',
    errorTip: 'Open \'Ethereum\' application on your Ledger and set \'Browser Support\' to \'yes\' in \'Settings\'',
  },
  isFetched: {
    successTitle: 'Ethereum address fetched successfully',
    errorTitle: 'Confirm Ethereum address on Ledger',
    errorTip: 'Open Ethereum application and confirm address',
  },
}
