const Joi = require('joi')
const AbstractModel = require('../../Core/lib/AbstractModel')

const schema = () => ({
  name: Joi.string().required(),
  password: Joi.string().required().allow(null),
  mnemonic: Joi.string().allow(null),
  seed: Joi.string().allow(null) // Root private key in hex
})

module.exports.schema = schema()

module.exports.model = class CredentialsModel extends AbstractModel {
  constructor (data, options) {
    super(data, schema, options)
  }
}
