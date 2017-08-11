// TODO @bshevchenko: this is intermediate version for demo
import BigNumber from 'bignumber.js'
import { abstractNoticeModel } from './notices/AbstractNoticeModel'
import { LHT, ETH } from 'redux/wallet/actions'

export default class ExchangeOrderModel extends abstractNoticeModel({
  description: null,
  symbol: null,
  limit: new BigNumber(0),
  limitSymbol: null,
  isBuy: null,
  buyPrice: new BigNumber(0),
  sellPrice: new BigNumber(0),
  accountBalance: new BigNumber(0),
  source: null
}) {

  sourceIsBuy (): boolean {
    return this.get('source').isBuy
  }

  sourceSymbol (): boolean {
    return this.get('source').symbol
  }

  limit (): BigNumber {
    return this.get('limit')
  }

  limitSymbol (): string {
    return this.symbol()
  }

  // TODO @bshevchenko
  mainSymbol (): string {
    return LHT
  }

  // TODO @bshevchenko
  secondSymbol (): string {
    return ETH
  }

  isMainSymbol (): boolean {
    return this.symbol() === this.mainSymbol()
  }

  isSecondSymbol (): boolean {
    return this.symbol() === this.secondSymbol()
  }

  symbol (): string {
    return this.get('symbol')
  }

  description (): string {
    return this.get('description')
  }

  isBuy (): boolean {
    return this.get('isBuy')
  }

  isSell (): boolean {
    return !this.isBuy()
  }

  isBuyMain (): boolean {
    return (this.isBuy() && this.isMainSymbol()) || (this.isSell() && this.isSecondSymbol())
  }

  isSellMain (): boolean {
    return !this.isBuyMain()
  }

  buyPrice (): BigNumber {
    return this.get('buyPrice')
  }

  sellPrice (): BigNumber {
    return this.get('sellPrice')
  }

  accountBalance (): BigNumber {
    return this.get('accountBalance')
  }

  accountBalanceSymbol (): string {
    return this.isMainSymbol() ? this.secondSymbol() : this.mainSymbol()
  }

  isPossible (main: BigNumber, second: BigNumber): boolean {
    // TODO @bshevchenko
    return true
  }
}
