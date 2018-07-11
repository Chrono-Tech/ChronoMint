import LedgerDevice from './lib/LedgerDevice'
import TrezorDevice from './lib/TrezorDevice'

export const ledgerDevice = new LedgerDevice()
export const trezorDevice = new TrezorDevice()

export const DEVICES = {
  ledger: ledgerDevice,
  trezor: trezorDevice
}
