import BigNumber from 'bignumber.js'
import type ERC20DAO from './ERC20DAO'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import lhtDAO from 'dao/LHTDAO'

export const TX_BUY = 'buy'
export const TX_SELL = 'sell'
export const TX_SET_PRICES = 'setPrices'
export const TX_WITHDRAW_TOKENS = 'withdrawTokens'
export const TX_WITHDRAW_ETH = 'withdrawEth'
export const TX_WITHDRAW_ALL = 'withdrawAllTokens'

// TODO @bshevchenko: this is intermediate version for demo
// TODO @bshevchenko: don't use LHT DAO directly, use getAssetDAO instead

export default class ExchangeDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/Exchange.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async getAssetDAO (): Promise<ERC20DAO> {

    if (!this._assetAddress) {
      this._assetAddress = await this._call('asset')
    }

    return contractsManagerDAO.getERC20DAO(this._assetAddress)
  }

  async getAssetSymbol (): string {
    const assetDAO = await this.getAssetDAO()
    return assetDAO.getSymbol()
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
    return lhtDAO.getAccountBalance('latest', await this.getAddress())
  }

  async getAccountAssetBalance (): Promise<BigNumber> {
    return lhtDAO.getAccountBalance()
  }

  async approveSell (amount: BigNumber) {
    return lhtDAO.approve(this.getInitAddress(), amount)
  }

  async sell (amount: BigNumber, price: BigNumber) {

    // TODO @bshevchenko: divide this on two steps
    await this.approveSell(amount)

    return this._tx(TX_SELL, [lhtDAO.addDecimals(amount), this._c.toWei(price)], {amount, price: amount.mul(price)})
  }

  async buy (amount: BigNumber, price: BigNumber) {

    const amountWithDecimals = lhtDAO.addDecimals(amount)
    const priceInWei = this._c.toWei(price)
    return this._tx(
      TX_BUY, [amountWithDecimals, priceInWei], {amount, price: amount.mul(price)}, amountWithDecimals.mul(priceInWei)
    )
  }

  async forward (data, infoArgs) {
    const managerDAO = await contractsManagerDAO.getExchangeManagerDAO()
    return managerDAO.forward(this.getInitAddress(), data, infoArgs)
  }

  async setPrices (buyPrice: BigNumber, sellPrice: BigNumber) {
    return this.forward(
      this.getData(TX_SET_PRICES, [this._c.toWei(buyPrice), this._c.toWei(sellPrice)])
    )
  }

  async withdrawTokens (recipient = this.getAccount(), amount: BigNumber) {
    const assetDAO = await this.getAssetDAO()
    return this.forward(
      this.getData(TX_WITHDRAW_TOKENS, [recipient, assetDAO.addDecimals(amount)])
    )
  }

  async withdrawETH (recipient = this.getAccount(), amount: BigNumber) {
    return this.forward(
      this.getData(TX_WITHDRAW_ETH, [recipient, this._c.toWei(amount)])
    )
  }

  async withdrawAll (recipient = this.getAccount()) {
    return this.forward(
      this.getData(TX_WITHDRAW_ALL, [recipient])
    )
  }
}
