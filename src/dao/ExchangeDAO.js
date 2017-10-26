import BigNumber from 'bignumber.js'

import AbstractContractDAO from 'dao/AbstractContractDAO'
import lhtDAO from 'dao/LHTDAO'

import type ERC20DAO from './ERC20DAO'

export const TX_BUY = 'buy'
export const TX_SELL = 'sell'

class ExchangeDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/Exchange.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
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
    const assetDAO = await this.getAssetDAO()
    return assetDAO.getAccountBalance(await this.getAddress())
  }

  async getAccountAssetBalance (): Promise<BigNumber> {
    const assetDAO = await this.getAssetDAO()
    return assetDAO.getAccountBalance()
  }

  async approveSell (amount: BigNumber) {
    const assetDAO = await this.getAssetDAO()
    return assetDAO.approve(this.getInitAddress(), assetDAO.addDecimals(amount))
  }

  async sell (amount: BigNumber, price: BigNumber) {
    const assetDAO = await this.getAssetDAO()


    // TODO @bshevchenko: divide this on two steps
    await this.approveSell(amount)

    return this._tx(TX_SELL, [assetDAO.addDecimals(amount), this._c.toWei(price)], { amount, price: amount.mul(price) })
  }

  async buy (amount: BigNumber, price: BigNumber) {
    const assetDAO = await this.getAssetDAO()
    const amountWithDecimals = assetDAO.addDecimals(amount)
    const priceInWei = this._c.toWei(price)
    return this._tx(TX_BUY, [amountWithDecimals, priceInWei], { amount, price: amount.mul(price) }, amountWithDecimals.mul(priceInWei))
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
