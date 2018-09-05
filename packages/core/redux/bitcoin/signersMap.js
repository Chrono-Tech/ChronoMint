/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BitcoinCashMemoryDevice from '../../services/signers/BitcoinCashMemoryDevice'
import BitcoinLedgerDevice from '../../services/signers/BitcoinLedgerDevice'
import BitcoinLedgerDeviceMock from '../../services/signers/BitcoinLedgerDeviceMock'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice'
import BitcoinTrezorDevice from '../../services/signers/BitcoinTrezorDevice'
import BitcoinTrezorDeviceMock from '../../services/signers/BitcoinTrezorMockDevice'

// eslint-disable-next-line import/prefer-default-export
export const bitcoinSignersMap = {
  'BitcoinCashMemoryDevice': BitcoinCashMemoryDevice,
  'BitcoinLedgerDevice': BitcoinLedgerDevice,
  'BitcoinLedgerDeviceMock': BitcoinLedgerDeviceMock,
  'BitcoinMemoryDevice': BitcoinMemoryDevice,
  'BitcoinTrezorDevice': BitcoinTrezorDevice,
  'BitcoinTrezorDeviceMock': BitcoinTrezorDeviceMock,
}
