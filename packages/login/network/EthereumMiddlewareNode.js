import AbstractNode from './AbstractNode'

export default class EthereumMiddlewareNode extends AbstractNode {
  constructor () {
    super(...arguments)

    console.log('EthereumMiddlewareNode: ', ...arguments)

    this.addListener('subscribe', (address) => this._handleSubscribe(address))
    this.addListener('unsubscribe', (address) => this._handleUnsubscribe(address))
    this.connect()
  }

  async _handleSubscribe ({ ethAddress, nemAddress }) {
    if (!this._socket) {
      return
    }
    try {
      await this._api.post('addr', {
        address: ethAddress,
        nem: nemAddress,
      })
    } catch (e) {
      this.trace('Address subscription error', e)
    }
  }

  async _handleUnsubscribe ({ ethAddress, nemAddress }) {
    try {
      await this._api.delete('addr', {
        address: ethAddress,
        nem: nemAddress,
      })
    } catch (e) {
      this.trace('Address unsubscription error', e)
    }
  }

  async getPlatformList (userAddress: string) {
    const response = await this._api.get(`events/PlatformRequested/?by='${userAddress}'`)
    if (response && response.data.length) {
      return response.data.map((p) => {
        return { address: p.platform, by: p.by, name: null }
      })
    }

    return []
  }

  subscribeToEvent (event) {
    this.executeOrSchedule(() => {
      this._subscriptions[ event ] = this._client.subscribe(
        `/exchange/events/app_eth_chrono_sc.${event}`,
        (message) => {
          try {
            const data = JSON.parse(message.body)

            this.emit(event, data)

          } catch (e) {
            this.trace('Failed to decode message', e)
          }
        },
      )
    })
  }
}
