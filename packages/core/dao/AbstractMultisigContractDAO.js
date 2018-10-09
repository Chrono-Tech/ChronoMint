/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import ethABI from 'ethereumjs-abi'
import TxExecModel from '../models/TxExecModel'
import AbstractContractDAO from './AbstractContractDAO'

export default class AbstractMultisigContractDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
    if (new.target === AbstractMultisigContractDAO) {
      throw new TypeError('Cannot construct AbstractMultisigContractDAO instance directly')
    }

    this._okCodes = [resultCodes.OK, resultCodes.MULTISIG_ADDED]
  }

  /**
   * Override this method if you want to provide special tx args decoding strategy for some function.
   * For example:
   * @see UserManagerDAO._decodeArgs
   * @see UserManagerDAO.addCBE
   * @protected
   */
  async _decodeArgs (func: string, args = {}): Promise<Object> {
    return args
  }

  async decodeData (data): Promise<TxExecModel> {
    if (typeof data !== 'string') {
      data = ''
    }
    const dataBuf = Buffer.from(data.replace(/^0x/, ''), 'hex')
    const methodId = dataBuf.slice(0, 4).toString('hex')
    const inputsBuf = dataBuf.slice(4)
    let args = {}

    const tx = await this.abi.abi.reduce((acc, obj) => {
      if (!obj.hasOwnProperty('inputs')) {
        return acc
      }
      const name = obj.name
      const types = obj.inputs.map((x) => x.type)
      const hash = ethABI.methodID(name, types).toString('hex')

      if (hash !== methodId) {
        return acc
      }
      const inputs = ethABI.rawDecode(types, inputsBuf, [])
      for (const key in inputs) {
        if (inputs.hasOwnProperty(key)) {
          const v = inputs[key]
          const t = types[key]
          if (/^bytes/i.test(t)) {
            inputs[key] = `0x${Buffer.from(v).toString('hex')}`
            continue
          }
          if (/^[u]?int/i.test(t)) {
            inputs[key] = new BigNumber(v)
            continue
          }
          switch (t) {
            case 'address':
              inputs[key] = `0x${v.toString(16)}`
              break
            case 'bool':
              inputs[key] = !!v
              break
            case 'string':
              inputs[key] = String(v)
              break
            default:
              throw new TypeError(`unknown type ${t}`)
          }
        }
      }

      for (const i in obj.inputs) {
        if (obj.inputs.hasOwnProperty(i)) {
          args[obj.inputs[i].name] = inputs[i]
        }
      }
      return new TxExecModel({
        contract: this.getContractName(),
        func: name,
      })
    }, null)

    if (!tx) {
      return null
    }

    args = await this._decodeArgs(tx.funcName(), args)

    const fields = {}
    Object.entries(args).forEach(([key, value]) => {
      fields[key] = {
        value,
        description: key,
      }
    })

    return new TxExecModel({
      ...tx,
      fields,
      contract: this.getContractName(),
    })
  }
}
