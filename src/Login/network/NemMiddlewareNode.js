import AbstractNode from './AbstractNode'

export default class NemMiddlewareNode extends AbstractNode {
  constructor () {
    super(...arguments)
    this.addListener('subscribe', (address) => this._handleSubscribe(address))
    this.addListener('unsubscribe', (address) => this._handleUnsubscribe(address))
  }

  async _handleSubscribe (address) {
    if (!this._socket) {
      return
    }
    try {
      await this._api.post('addr', { address })
    } catch (e) {
      this.trace('Address subscription error', e)
    }
  }

  async _handleUnsubscribe (address) {
    try {
      await this._api.delete('addr', { address })
    } catch (e) {
      this.trace('Address unsubscription error', e)
    }
  }
}
