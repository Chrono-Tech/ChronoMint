import type AbstractModel from 'models/AbstractModel'
import type PendingManagerDAO from 'dao/PendingManagerDAO'

import ethABI from 'ethereumjs-abi'

import AbstractContractDAO, { TX_FRONTEND_ERROR_CODES, TxError } from './AbstractContractDAO'
import TxExecModel from 'models/TxExecModel'

import contractsManagerDAO from './ContractsManagerDAO'
import resultCodes from 'chronobank-smart-contracts/common/errors'


export default class AbstractMultisigContractDAO extends AbstractContractDAO {
  constructor (json, at = null, eventsJSON) {
    if (new.target === AbstractMultisigContractDAO) {
      throw new TypeError('Cannot construct AbstractMultisigContractDAO instance directly')
    }
    super(json, at, eventsJSON)

    this._okCodes = [resultCodes.OK, resultCodes.MULTISIG_ADDED]
  }

  /**
   * Use this method for all multisig txs.
   * @see _tx for args description
   * @param func
   * @param args
   * @param infoArgs
   * @protected
   */
  async _multisigTx (func: string, args: Array = [], infoArgs: Object | AbstractModel = null): Promise<Object> {
    const dao: PendingManagerDAO = await contractsManagerDAO.getPendingManagerDAO()

    const web3 = await this._web3Provider.getWeb3()
    const data = await this.getData(func, args)
    const hash = web3.sha3(data, {encoding: 'hex'})

    const [isDone, receipt] = await Promise.all([
      dao.watchTxEnd(hash),
      await this._tx(func, args, infoArgs, null, dao.getInitAddress(), [resultCodes.OK])
    ])

    if (!isDone) {
      throw new TxError('Cancelled via Operations module', TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED)
    }

    return receipt
  }

  /**
   * Override this method if you want to provide special tx args decoding strategy for some function.
   * For example:
   * @see UserManagerDAO._decodeArgs
   * @see UserManagerDAO.addCBE
   * @param func
   * @param args
   * @protected
   * @returns {Promise<Object>}
   */
  async _decodeArgs (func: string, args: Array = []) {
    return args
  }

  /** @returns {TxExecModel} */
  async decodeData (data) {
    if (typeof data !== 'string') {
      data = ''
    }
    const dataBuf = Buffer.from(data.replace(/^0x/, ''), 'hex')
    const methodId = dataBuf.slice(0, 4).toString('hex')
    const inputsBuf = dataBuf.slice(4)

    const tx = await this._json.abi.reduce((acc, obj) => {
      if (!obj.hasOwnProperty('inputs')) {
        return acc
      }
      const name = obj.name
      const types = obj.inputs.map(x => x.type)
      const hash = ethABI.methodID(name, types).toString('hex')

      if (hash !== methodId) {
        return acc
      }
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
      return new TxExecModel({
        contract: this.getContractName(),
        func: name,
        args
      })
    }, null)

    if (!tx) {
      return null
    }

    const args = await this._decodeArgs(tx.funcName(), tx.args())

    return tx.set('args', args)
  }
}
