import BigNumber from 'bignumber.js'
import AbstractNode from './AbstractNode'
import { DECIMALS } from './BitcoinEngine'

export default class AssetMiddlewareNode extends AbstractNode {
  constructor ({ feeRate, ...args }) {
    super(args)

    this.addListener('subscribe', (address) => this._handleSubscribe(address))

    this.connect()
  }

  async _handleSubscribe (address) {
    if (!this._socket) {
      return
    }
    try {
      await this._api.post('addr', { address })
      this.executeOrSchedule(() => {
        this._subscriptions[ `balance:${address}` ] = this._client.subscribe(
          `/exchange/events/eth_app_chrono_sc.*`,
          // `${socket.channels.balance}.*`,
          (message) => {
            console.log('Subscribe message: ', message)
            try {
              const data = JSON.parse(message.body)
              console.log('Subscribe message parsed: ', data)

            } catch (e) {
              this.trace('Failed to decode message', e)
            }
          },
        )
      })
    } catch (e) {
      this.trace('Address subscription error', e)
    }
  }


}
