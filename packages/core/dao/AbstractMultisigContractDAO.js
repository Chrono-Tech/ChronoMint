/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import ethABI from 'ethereumjs-abi'
import type PendingManagerDAO from './PendingManagerDAO'
import type AbstractModel from '../models/AbstractModelOld'
import TxError from '../models/TxError'
import TxExecModel from '../models/TxExecModel'
import contractsManagerDAO from './ContractsManagerDAO'
import AbstractContractDAO from './AbstractContract3DAO'

//#region CONSTANTS

import {
  DEFAULT_TX_OPTIONS,
  TX_FRONTEND_ERROR_CODES,
} from './constants'

//#endregion CONSTANTS

export default class AbstractMultisigContractDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
    if (new.target === AbstractMultisigContractDAO) {
      throw new TypeError('Cannot construct AbstractMultisigContractDAO instance directly')
    }

    this._okCodes = [resultCodes.OK, resultCodes.MULTISIG_ADDED]
  }

  /**
   * Use this method for all multisig txs.
   * @see _tx for args description
   * @param func
   * @param args
   * @param infoArgs
   * @param options
   * @protected
   */
  async _multisigTx (func: string, args: Array = [], infoArgs: Object | AbstractModel = null, options = DEFAULT_TX_OPTIONS): Promise<Object> {
    const dao: PendingManagerDAO = await contractsManagerDAO.getPendingManagerDAO()

    const web3 = await this._web3Provider.getWeb3()
    const data = await this.getData(func, args)
    const hash = web3.sha3(data, { encoding: 'hex' })

    const [isDone, receipt] = await Promise.all([
      dao.watchTxEnd(hash),
      await this._tx(func, args, infoArgs, null, {
        ...options,
        addDryRunFrom: dao.getInitAddress(),
        addDryRunOkCodes: this._okCodes,
      }),
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

    let fields = {}
    Object.entries(args).map(([key, value]) => {
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
