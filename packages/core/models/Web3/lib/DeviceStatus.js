const Joi = require('joi')
const AbstractModel = require('../../Core/lib/AbstractModel')
const TxEntryModel = require('./TxEntryModel').model

const schemaFactory = () => ({
  name: Joi.string().required(),
  isActive: Joi.boolean(),
  isBusy: Joi.boolean(),
  info: Joi.any(),
  device: Joi.any(),
  queue: Joi.array().items(Joi.object().type(TxEntryModel)).default([])
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class DeviceStatus extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  get key () {
    return this.name
  }

  update (props) {
    return new DeviceStatus({
      ...this,
      ...props
    })
  }
}
