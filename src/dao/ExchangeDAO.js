import BigNumber from 'bignumber.js'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import lhtDAO from 'dao/LHTDAO'
import TokenModel from 'models/TokenModel'
import { ExchangeABI, MultiEventsHistoryABI } from './abi'
import type ERC20DAO from './ERC20DAO'

export const TX_BUY = 'buy'
export const TX_SELL = 'sell'

export class ExchangeDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(ExchangeABI, at, MultiEventsHistoryABI)
  }

  // TODO @bshevchenko
  async getAssetDAO (): Promise<ERC20DAO> {
    return lhtDAO
  }

  async getBuyPrice (): Promise<BigNumber> {
    const price = await this._call('buyPrice')
    return this._c.fromWei(price)
  }

  async getSellPrice (): Promise<BigNumber> {
    const price = await this._call('sellPrice')
    return this._c.fromWei(price)
  }

  async getETHBalance (): Promise<BigNumber> {
    const balance = await this._web3Provider.getBalance(await this.getAddress())
    return this._c.fromWei(balance)
  }

  async getAssetBalance (): Promise<BigNumber> {
    const result = await this._call('assetBalance')
    return result
  }

  async getAccountAssetBalance (): Promise<BigNumber> {
    const assetDAO = await this.getAssetDAO()
    return assetDAO.getAccountBalance()
  }

  async approveSell (token: TokenModel, amount: BigNumber) {
    const assetDAO = await token.dao()
    return assetDAO.approve(this.getInitAddress(), assetDAO.addDecimals(amount))
  }

  async sell (amount: BigNumber, price: BigNumber, token: TokenModel) {
    // TODO @bshevchenko: divide this on two steps
    await this.approveSell(token, amount)

    return this._tx(
      TX_SELL,
      [
        token.dao().addDecimals(amount),
        token.dao().addDecimals(price),
      ],
      {
        amount,
        price: amount.mul(price),
      })
  }

  async buy (amount: BigNumber, price: BigNumber, token: TokenModel) {
    const priceInWei = this._c.toWei(price)
    return this._tx(
      TX_BUY,
      [
        token.dao().addDecimals(amount),
        priceInWei.div(Math.pow(10, token.decimals())),
      ],
      {
        amount,
        price: amount.mul(price),
      }, priceInWei
    )
  }

  subscribeOnReset () {
    this._web3Provider.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset () {
    if (this.contract) {
      this.contract = this._initContract()
    }
  }
}

export default new ExchangeDAO()
