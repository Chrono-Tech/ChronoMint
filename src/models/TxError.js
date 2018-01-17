export default class TxError extends Error {
  constructor (message, code, codeValue = null) {
    super(message)
    this.code = code
    this.codeValue = codeValue
  }
}
