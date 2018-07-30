const Joi = require('joi')
const AbstractModel = require('../../Core/lib/AbstractModel')
const WalletEntryModel = require('./WalletEntryModel').model
const SignerModel = require('./SignerModel')

const schema = () => ({
  signer: Joi.object().type(SignerModel).required(),
  entry: Joi.object().type(WalletEntryModel).required()
})

module.exports.schema = schema()

module.exports.model = class WalletModel extends AbstractModel {
  constructor (data, options) {
    super(data, schema, options)
    Object.freeze(this)
  }
}
