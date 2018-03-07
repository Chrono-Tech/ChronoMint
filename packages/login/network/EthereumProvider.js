import AbstractProvider from './AbstractProvider'
import type EthereumEngine from './EthereumEngine'
import selectEthereumNode from './EthereumNode'

export class EthereumProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._nemEngine = null
    this._id = 'Ethereum'
  }

  setEngine (ethEngine: EthereumEngine, nemEngine) {
    if (this._isInited) {
      this.unsubscribe(this._engine, this._nemEngine)
    }
    this._engine = ethEngine
    this._nemEngine = nemEngine
    this.subscribe(this._engine, this._nemEngine)
    this._isInited = true
  }

  subscribe (ethEngine: EthereumEngine, nemEngine) {
    const node = this._selectNode(ethEngine)

    node.emit('subscribe', {
      ethAddress: ethEngine.getAddress(),
      nemAddress: nemEngine && nemEngine.getAddress(),
    })
    return node
  }

  unsubscribe (ethEngine: EthereumEngine, nemEngine) {
    const node = this._selectNode(ethEngine)
    node.emit('unsubscribe', {
      ethAddress: ethEngine.getAddress(),
      nemAddress: nemEngine && nemEngine.getAddress(),
    })
    return node
  }

  getPrivateKey () {
    return this._engine ? this._engine.getPrivateKey() : null
  }

  getPlatformList (userAddress: string) {
    const node = this._selectNode(this._engine)
    return node.getPlatformList(userAddress)
  }

  getEventsData (eventName: string, queryFilter: string, mapCallback) {
    const node = this._selectNode(this._engine)
    return node.getEventsData(eventName, queryFilter, mapCallback)
  }

  subscribeOnMiddleware (event, callback) {
    const node = this._selectNode(this._engine)
    node.subscribeToEvent(event)
    node.on(event, callback)
  }
}

export const ethereumProvider = new EthereumProvider(selectEthereumNode)
