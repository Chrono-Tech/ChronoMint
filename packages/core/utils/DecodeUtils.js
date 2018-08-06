/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { zipWith } from 'lodash'
import Tx from 'ethereumjs-tx'
import ethAbi from 'ethereumjs-abi'
// import BN from 'bn.js'
import BigNumber from 'bignumber.js'

export const decodeTxData = (abi, data) => {
  const dataBuf = Buffer.from(data.replace(/^0x/, ``), `hex`)
  const methodId = dataBuf.slice(0, 4).toString(`hex`)
  const inputsBuf = dataBuf.slice(4)

  const result = abi.reduce((acc, obj) => {
    const name = obj.name
    const types = obj.inputs ? obj.inputs.map((x) => x.type) : []
    const names = obj.inputs ? obj.inputs.map((x) => x.name) : []
    const hash = ethAbi.methodID(name, types).toString(`hex`)

    if (hash === methodId) {
      const inputs = ethAbi.rawDecode(types, inputsBuf, [])
      return {
        name,
        types,
        names,
        inputs,
        params: zipWith(
          names, types, inputs,
          (name, type, value) => ({
            name,
            type,
            value: (value instanceof BigNumber)
              ? new BigNumber(value.toString())
              : value,
          }),
        ),
      }
    }

    return acc
  }, {})
  return result
}

export const decodeTxRaw = (abi, raw) => {
  const tx = new Tx(raw)
  return decodeTxData(abi, tx.data)
}
