import NemEngine from './NemEngine'

export class NemProvider {

  isInitialized () {
    return this._engine != null
  }

  setEngine (engine: NemEngine) {
    this._engine = engine
  }

  getAddress () {
    return this._engine && this._engine.getAddress() || null
  }
}

export const nemProvider = new NemProvider()
