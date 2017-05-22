import React from 'react'
import ExchangeDAO from '../../../src/dao/ExchangeDAO'
import ExchangeContractModel, {validate} from '../../../src/models/contracts/ExchangeContractModel'
import ExchangeForm from '../../../src/components/forms/settings/other/ExchangeForm'

let contract: ExchangeContractModel

describe('exchange contract model', () => {
  beforeAll(() => {
    return ExchangeDAO.getAddress().then(address => {
      contract = new ExchangeContractModel(address)
    })
  })

  it('should return dao', () => {
    return contract.dao().then(dao => {
      return dao.getAddress().then(address => {
        expect(address).toEqual(contract.address())
      })
    })
  })

  it('should return name', () => {
    expect(contract.name()).toEqual('Exchange')
  })

  it('should return sell and buy prices', () => {
    contract = contract.set('settings', {buyPrice: '1234', sellPrice: '2345'})
    expect(contract.buyPrice()).toEqual(1234)
    expect(contract.sellPrice()).toEqual(2345)
  })

  it('should return form', () => {
    const onSubmit = (a) => a
    expect(contract.form('ref', onSubmit)).toEqual(<ExchangeForm ref={'ref'} onSubmit={onSubmit}/>)
  })

  it('should validate', () => {
    const values = new Map()
    values.set('buyPrice', contract.buyPrice())
    values.set('sellPrice', contract.sellPrice())
    expect(validate(values)).toEqual({
      'buyPrice': null,
      'sellPrice': null
    })
  })

  it('should not validate', () => {
    const values = new Map()
    values.set('buyPrice', 20)
    values.set('sellPrice', 10)
    expect(validate(values).sellPrice.length).toEqual(1)
  })
})
