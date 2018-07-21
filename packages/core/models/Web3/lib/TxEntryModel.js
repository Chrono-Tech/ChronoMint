const Joi = require('joi')
const AbstractModel = require('../../Core/lib/AbstractModel')
const TxExecModel = require('./TxExecModel').model

const schemaFactory = () => ({
  key: Joi.string().required(),
  tx: Joi.object().type(TxExecModel).required(),
  hash: Joi.string().allow(null),
  raw: Joi.string().allow(null),
  receipt: Joi.object().allow(null),
  isSubmitted: Joi.boolean(),
  isPending: Joi.boolean(),
  isAccepted: Joi.boolean(),
  isRejected: Joi.boolean(),
  isSigned: Joi.boolean(),
  isSent: Joi.boolean(),
  isErrored: Joi.boolean(),
  isMined: Joi.boolean()
})

module.exports.schemaFactory = schemaFactory

/**
* Model for account
*/
module.exports.model = class TxEntryModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory(), options)
  }

  static fromWeb3 (tx, { block }) {
    return new TxEntryModel({
      block
    })
  }
}
