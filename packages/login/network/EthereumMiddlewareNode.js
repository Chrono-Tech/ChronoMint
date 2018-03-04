import { getUsersPlatforms, getPlatforms } from 'redux/assetsManager/actions'
import { store } from 'redux/configureStore'
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
      this.executeOrSchedule(() => {
        console.log('EthereumMiddlewareNode: executeOrSchedule: here')
        this._subscriptions[ `all_events:testing` ] = this._client.subscribe(
          `/exchange/events/app_eth_chrono_sc.platformrequested`,
          (message) => {
            console.log('EthereumMiddlewareNode: Subscribe message requested: ', message)
            try {
              const data = JSON.parse(message.body)
              console.log('EthereumMiddlewareNode: Subscribe message parsed: ', data)

              store.dispatch(getUsersPlatforms())
              store.dispatch(getPlatforms())

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
}
