import BigNumber from 'bignumber.js'
import Amount from 'models/Amount'

class CustomSerializer {
  test (val) {
    return this._serialize(val)
  }

  print (val) {
    return this._serialize(val)
  }

  _serialize (item, i = 0) {
    let result = ''
    let spaces = ''
    for (let j = 0; j <= i; j++) {
      spaces += '  '
    }

    if (item === null || item === undefined) {
      return item
    }

    if (typeof item.toJSON === 'function') {
      item = item.toJSON()
    }

    let keys = Object.keys(item).sort()

    for (let key of keys) {
      let value = item[ key ]
      if (typeof value === 'object' && value !== null && value !== undefined) {
        if (value instanceof BigNumber || value instanceof Amount) {
          result += `${spaces}"${key}": ${value},\r`
        } else {
          value = this._serialize(value, i + 1)
          result += `${spaces}"${key}": {\r${value}${spaces}},\r`
        }
      } else if (typeof value === 'function') {
        result += `${spaces}"${key}": Function,\r`
      } else {
        result += `${spaces}"${key}": ${value},\r`
      }
    }
    return result
  }
}

export default new CustomSerializer()
