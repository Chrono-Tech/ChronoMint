const Joi = require('joi')
const AbstractModel = require('../../Core/lib/AbstractModel')
const TxExecModel = require('./TxExecModel').model

const schemaFactory = () => ({
  hash: Joi.string().allow(null),
  date: Joi.object().type(Date),
  transactions: Joi.array().items(Joi.object().type(TxExecModel)).allow(null)
})

module.exports.schemaFactory = schemaFactory

/**
* Model for account
*/
module.exports.model = class BlockExecModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  key () {
    return this.hash
  }

  static fromWeb3 (data) {
    return new BlockExecModel(block => {
      // console.log(data)
      return {
        hash: data.hash,
        date: new Date(data.timestamp * 1000),
        transactions: (data.transactions || []).map(tx => TxExecModel.fromWeb3(tx, { block }))
      }
    })
  }
}
