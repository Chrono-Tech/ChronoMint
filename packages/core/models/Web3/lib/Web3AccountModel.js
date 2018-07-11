// const Joi = require('joi')
// const AbstractModel = require('../../Core/lib/AbstractModel')
// const Currency = require('./Currency').model
//
// const schema = () => ({
//   address: Joi.number().required(),
//   privateKey: Joi.number().required(),
//   signTransaction: Joi.func().arity(2),
//   sign: Joi.func().arity(1),
//   amount: Joi.number().required(),
//   currency: Joi.object().type(Currency).required()
// })
//
// module.exports.schema = schema()
//
// /**
// * Model for account
// */
// module.exports.model = class Account extends AbstractModel {
//   constructor (data, options) {
//     super(data, schema, options)
//     Object.freeze(this)
//   }
//   static fromJSON (data, context, options) {
//     return new Account({
//       ...data,
//       currency: new Currency(data.currency)
//     },
//     { stripUnknown: true })
//   }
// }
