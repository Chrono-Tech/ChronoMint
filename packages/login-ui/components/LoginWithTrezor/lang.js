/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const en = {
  title: 'Import account from Trezor',
  login: 'Login',
  or: 'or',
  back: '',
  ethAddress: 'Ethereum address',
  isHttps: {
    successTitle: 'HTTPS protocol provided',
    errorTitle: 'HTTPS protocol only',
    errorTip: 'Trezor works over HTTPS protocol only',
  },
  isU2F: {
    successTitle: 'U2F supported',
    errorTitle: 'U2F is not supported',
    errorTip: 'TrezorWallet uses U2F which is not supported by your browser. Use Chrome, Opera or Firefox with a U2F extension.',
  },
  isETHAppOpened: {
    successTitle: 'Ethereum application found successfully',
    errorTitle: 'Ethereum application is not opened',
    errorTip: 'Open \'Ethereum\' application on your Trezor and set \'Browser Support\' to \'yes\' in \'Settings\'',
  },
  isConnected: {
    successTitle: 'Trezor plugged',
    errorTitle: 'Plug in your device',
    errorTip: 'In order to continue please plug in your Trezor device.',
  },
}
