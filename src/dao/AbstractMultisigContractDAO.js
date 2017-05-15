import AbstractContractDAO from './AbstractContractDAO'
import TransactionExecModel from '../models/TransactionExecModel'
import ethABI from 'ethereumjs-abi'

class AbstractMultisigContractDAO extends AbstractContractDAO {
  constructor (json, at = null) {
    if (new.target === AbstractMultisigContractDAO) {
      throw new TypeError('Cannot construct AbstractMultisigContractDAO instance directly')
    }
    super(json, at)
  }

  // noinspection JSUnusedLocalSymbols
  /**
   * Override this method if you want to provide special tx args decoding strategy for some function.
   * For example:
   * @see UserDAO._decodeArgs
   * @see UserDAO.treatCBE
   * @param func
   * @param args
   * @protected
   * @returns {Promise.<Object>}
   */
  _decodeArgs (func: string, args: Array = []) {
    return Promise.resolve(args)
  }

  /** @returns {TransactionExecModel} */
  decodeData (data) {
    if (typeof data !== 'string') {
      data = ''
    }
    const dataBuf = Buffer.from(data.replace(/^0x/, ''), 'hex')
    const methodId = dataBuf.slice(0, 4).toString('hex')
    const inputsBuf = dataBuf.slice(4)

    return Promise.resolve(this._json.abi.reduce((acc, obj) => {
      if (obj.hasOwnProperty('inputs')) {
        const name = obj.name
        const types = obj.inputs.map(x => x.type)
        const hash = ethABI.methodID(name, types).toString('hex')

        if (hash === methodId) {
          const inputs = ethABI.rawDecode(types, inputsBuf, [])
          for (let key in inputs) {
            if (inputs.hasOwnProperty(key)) {
              const v = inputs[key]
              const t = types[key]
              if (/^bytes/i.test(t)) {
                inputs[key] = '0x' + Buffer.from(v).toString('hex')
                continue
              }
              if (/^[u]?int/i.test(t)) {
                inputs[key] = v.toNumber()
                continue
              }
              switch (t) {
                case 'address':
                  inputs[key] = '0x' + v.toString(16)
                  break
                case 'bool':
                  inputs[key] = !!v
                  break
                case 'string':
                  console.warn('string type resolving not tested, remove this if you sure that it works correctly')
                  inputs[key] = String(v)
                  break
                default:
                  throw new TypeError('unknown type ' + t)
              }
            }
          }
          const args = {}
          for (let i in obj.inputs) {
            if (obj.inputs.hasOwnProperty(i)) {
              args[obj.inputs[i].name] = inputs[i]
            }
          }
          return new TransactionExecModel({
            contract: this.getContractName(),
            func: name,
            args
          })
        }
      }
      return acc
    }, null)).then(tx => {
      if (tx === null) {
        return tx
      }
      return this._decodeArgs(tx.funcName(), tx.args()).then(args => tx.set('args', args))
    })
  }

  /**
   * Override this method by returning an object with multisig functions names as a keys and settings as a values.
   * Settings is an array in which the first element must be the name of key (id) argument and the second element must
   * be the flag, that says whether this function adds new element (isRevoked) or deletes/updates old element.
   * For example...
   * @see UserDAO._multisigFuncs
   * @see getFitMultisig
   * @returns {Object}
   * @protected
   */
  _multisigFuncs () {
    return {}
  }

  /**
   * If provided tx fits some multisig function from called DAO, then it will return settings of this function from...
   * @see _multisigFuncs
   * @param tx
   * @returns {{id: *, isRevoked: boolean}}
   */
  getFitMultisig (tx: TransactionExecModel) {
    let id = null
    let isRevoked = null
    if (tx.contract() === this.getContractName()) {
      const f = this._multisigFuncs()
      for (let i in f) {
        if (f.hasOwnProperty(i) && tx.funcName() === i) {
          id = tx.args()[f[i][0]]
          isRevoked = f[i][1]
          break
        }
      }
    }
    return {id, isRevoked}
  }
}

export default AbstractMultisigContractDAO
