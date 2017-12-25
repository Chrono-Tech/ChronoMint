import AbstractProvider from './AbstractProvider'
import type EthereumEngine from './EthereumEngine'
import selectEthereumNode from './EthereumNode'
import type NemEngine from './NemEngine'

export class EthereumProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._nemEngine = null
    this._id = 'Ethereum'
  }

  setEngine (ethEngine: EthereumEngine, nemEngine: NemEngine) {
    if (this._isInited) {
      this.unsubscribe(this._engine, this._nemEngine)
    }
    this._engine = ethEngine
    this._nemEngine = nemEngine
    this.subscribe(this._engine, this._nemEngine)
    this._isInited = true
  }

  subscribe (ethEngine: EthereumEngine, nemEngine: NemEngine) {
    const node = this._selectNode(ethEngine)

    node.emit('subscribe', {
      ethAddress: ethEngine.getAddress(),
      nemAddress: nemEngine.getAddress(),
    })
    return node
  }

  unsubscribe (ethEngine: EthereumEngine, nemEngine: NemEngine) {
    const node = this._selectNode(ethEngine)
    node.emit('unsubscribe', {
      ethAddress: ethEngine.getAddress(),
      nemAddress: nemEngine.getAddress(),
    })
    return node
  }
}

export const ethereumProvider = new EthereumProvider(selectEthereumNode)
