const Joi = require('joi')
const AbstractModel = require('../../Core/lib/AbstractModel')
// THe value of this constant receved from Igor P.
const HEX = /^0[xX][0-9A-Fa-f]*$/

const schema = () => ({
  rawtx: Joi.string().required().regex(HEX)
})

module.exports.schema = schema()

module.exports.model = class RawTransacation extends AbstractModel {
  constructor (data, options) {
    super(data, schema, options)
  }
}
