const Joi = require('joi')
const AbstractModel = require('../../Core/lib/AbstractModel')
const { HEX } = require('../../Core/lib/Constants')

const schema = () => ({
  rawtx: Joi.string().required().regex(HEX)
})

module.exports.schema = schema()

module.exports.model = class RawTransacation extends AbstractModel {
  constructor (data, options) {
    super(data, schema, options)
  }
}
