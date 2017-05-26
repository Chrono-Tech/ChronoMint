import React from 'react'
import ExchangeDAO from '../../../src/dao/ExchangeDAO'
import ExchangeContractModel from '../../../src/models/contracts/ExchangeContractModel'
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
    expect(contract.form('ref', onSubmit)).toEqual(<ExchangeForm ref={'ref'} onSubmit={onSubmit} />)
  })
})
