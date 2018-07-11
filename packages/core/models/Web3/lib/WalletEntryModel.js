const Joi = require('joi')
const AbstractModel = require('../../Core/lib/AbstractModel')

const schema = () => ({
  key: Joi.string(),
  name: Joi.string(),
  type: Joi.string().default('memory').allow(['memory', 'device']),
  path: Joi.string(),
  encrypted: Joi.any()
})

module.exports.schema = schema()

module.exports.model = class WalletEntryModel extends AbstractModel {
  constructor (data, options) {
    super(data, schema, options)
  }

  get address () {
    switch (this.type) {
      case 'memory':
        return `0x${this.encrypted[0].address}`
      case 'device':
        return this.encrypted.address
    }
  }

  isMemoryWallet () {
    return !this.type || this.type === 'memory'
  }
}
