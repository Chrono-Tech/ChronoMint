export const TRANSFER_CANCELLED = 'TRANSFER_CANCELLED'
export const TRANSFER_UNKNOWN = 'TRANSFER_UNKNOWN'

export default class TransferError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
  }
}
