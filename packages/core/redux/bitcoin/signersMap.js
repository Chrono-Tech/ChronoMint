/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BitcoinCashMemoryDevice from '../../services/signers/BitcoinCashMemoryDevice'
import BitcoinLedgerDevice from '../../services/signers/BitcoinLedgerDevice'
import BitcoinLedgerDeviceMock from '../../services/signers/BitcoinLedgerDeviceMock'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice'

export const signersMap = {
  'BitcoinCashMemoryDevice': BitcoinCashMemoryDevice,
  'BitcoinMemoryDevice': BitcoinMemoryDevice,
  'BitcoinLedgerDevice': BitcoinLedgerDevice,
  'BitcoinLedgerDeviceMock': BitcoinLedgerDeviceMock,

}
