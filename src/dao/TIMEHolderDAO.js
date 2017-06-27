import AbstractContractDAO from './AbstractContractDAO'
import ContractsManagerDAO from './ContractsManagerDAO'
import errorCodes from './errorCodes'

export const TX_DEPOSIT = 'deposit'
export const TX_WITHDRAW_SHARES = 'withdrawShares'

export default class TIMEHolderDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/TimeHolder.json'), at)
    // TODO @dkchv: remove all except OK after SC update and backend research
    // cause TIMEHOLDER_DEPOSIT_FAILED and TIMEHOLDER_WITHDRAWN_FAILED
    // - is like warning, not error, backend says
    this._txOkCodes = [
      ...this._txOkCodes,
      errorCodes.TIMEHOLDER_DEPOSIT_FAILED,
      errorCodes.TIMEHOLDER_WITHDRAWN_FAILED
    ]
  }

  /** @returns {Promise<ERC20DAO>} */
  getAssetDAO () {
    return this._call('sharesContract').then(address => {
      return ContractsManagerDAO.getERC20DAO(address)
    })
  }

  async deposit (amount: number) {
    const assetDAO = await this.getAssetDAO()
    const account = await this.getAddress()

    // dryRuns
    const gases = await Promise.all([
      await assetDAO.pluralApprove(account, amount, {isDryRun: true}),
      await this.pluralDeposit(assetDAO, amount, {isDryRun: true})
    ])

    const totalGas = gases.reduce((memo, gas) => {
      memo += gas
      return memo
    }, 0)

    // confirm and run tx
    await assetDAO.pluralApprove(account, amount, {step: 1, of: 2, totalGas})
    return this.pluralDeposit(assetDAO, amount, {step: 2, of: 2, totalGas})
  }

  pluralDeposit (assetDAO, amount: number, plural: Object) {
    return this._tx(TX_DEPOSIT, [assetDAO.addDecimals(amount)], {amount}, null, null, null, plural)
  }

  async withdraw (amount: number) {
    const assetDAO = await this.getAssetDAO()
    return this._tx(TX_WITHDRAW_SHARES, [assetDAO.addDecimals(amount)], {amount})
  }

  async getAccountDepositBalance (account: string) {
    const assetDAO = await this.getAssetDAO()
    return this._callNum('depositBalance', [account]).then(r => assetDAO.removeDecimals(r))
  }
}
