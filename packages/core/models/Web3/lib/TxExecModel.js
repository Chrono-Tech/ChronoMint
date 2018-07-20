const Joi = require('joi')
const Tx = require('ethereumjs-tx')
const BigNumber = require('bignumber.js')
const AbstractModel = require('../../Core/lib/AbstractModel')

const schemaFactory = () => ({
  hash: Joi.string().allow(null),
  from: Joi.string().required(),
  to: Joi.string().required(),
  value: Joi.object().type(BigNumber).allow(null),
  gas: Joi.object().type(BigNumber).allow(null),
  gasPrice: Joi.object().type(BigNumber).allow(null),
  data: Joi.string().allow(null),
  chainId: Joi.number().allow(null),
  nonce: Joi.number().allow(null)
})

module.exports.schemaFactory = schemaFactory

/**
* Model for account
*/
module.exports.model = class TxExecModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory(), options)
    Object.freeze(this)
  }

  static fromWeb3 (tx, { block }) {
    const ethTx = new Tx(tx.raw)
    return new TxExecModel({
      block,
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      nonce: tx.nonce,
      data: ethTx.data && ethTx.data.length
        ? ethTx.data.toString('hex')
        : null,
      value: tx.value != null
        ? new BigNumber(tx.value)
        : null,
      gas: tx.gas != null
        ? new BigNumber(tx.gas)
        : null,
      gasPrice: tx.gasPrice != null
        ? new BigNumber(tx.gasPrice)
        : null
    })
  }
}
