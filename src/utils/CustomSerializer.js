import BigNumber from 'bignumber.js'
import Amount from 'models/Amount'

class CustomSerializer {
  test (val) {
    return this._serialize(val)
  }

  print (val) {
    return this._serialize(val)
  }

  _keysSort (object) {
    let sortedObject = Array.isArray(object) ? [] : {}

    if (typeof object.toJSON === 'function') {
      object = object.toJSON()
    }

    let keys = Object.keys(object).sort()

    for (let key of keys) {
      if (typeof object[ key ] === 'object' && object[ key ] !== null) {
        sortedObject[ key ] = object[ key ].constructor.name === 'BigNumber' || object[ key ].constructor.name === 'Amount'
          ? object[ key ].toString()
          : this._keysSort(object[ key ])
      } else {
        sortedObject[ key ] = object[ key ]
      }
    }

    return sortedObject
  }

  _serialize (item) {
    let result = ''

    if (item === null) return `null`

    if (typeof item === 'object') {
      result += `${JSON.stringify(this._keysSort(item), null, '  ')}`
    } else {
      result = `${item},\r`
    }
    return `${result}`
  }
}

export default new CustomSerializer()
