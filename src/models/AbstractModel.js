import * as performance from 'moment'
import { Record as record } from 'immutable'

const HEX_BASE = 16

// noinspection JSUnusedLocalSymbols
export const abstractModel = defaultValues => class AbstractModel extends record({
  ...defaultValues,
  id: null,
  random: null,
  timestamp: null,
}) {
  id () {
    return this.get('id')
  }

  txSummary () {
    return this.toJS()
  }

  summary (): Object {
    return this.toJS()
  }

  toJS () {
    return super.toJS()
  }

  _getSet (key, value) {
    return value === undefined ? this.get(key) : this.set(key, value)
  }

  static genRandom () {
    return [1, 2, 3, 4, 5, 6, 7, 8].map(() => Math.floor(Math.random() * HEX_BASE).toString(HEX_BASE)).join('')
  }

  static genTimestamp () {
    return performance.now()
  }

  static genSymbol () {
    const random = AbstractModel.genRandom()
    const timestamp = AbstractModel.genTimestamp()
    return { random, timestamp }
  }

  timestamp () {
    return this.get('timestamp')
  }

  random () {
    return this.get('random')
  }

  symbol () {
    return `${this.random()}_${this.timestamp()}`
  }
}

export default abstractModel()
