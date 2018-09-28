/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  WALLET_TYPE_LEDGER,
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_LEDGER_MOCK,
  WALLET_TYPE_TREZOR_MOCK,
} from '../models/constants/AccountEntryModel'

const TYPES_TO_SHOW_MODAL = [WALLET_TYPE_LEDGER, WALLET_TYPE_TREZOR, WALLET_TYPE_LEDGER_MOCK, WALLET_TYPE_TREZOR_MOCK]

export const isShowSignTransactionModal = (signerType) => {
  return TYPES_TO_SHOW_MODAL.includes(signerType)
}
