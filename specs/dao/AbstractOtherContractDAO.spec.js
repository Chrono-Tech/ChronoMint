import AbstractOtherContractDAO from '../../src/dao/AbstractOtherContractDAO'

describe('abstract other contract DAO', () => {
  it('should not construct class', () => {
    expect(() => {
      const dao = new AbstractOtherContractDAO()
      dao.retrieveSettings().then()
    }).toThrow(new TypeError('Cannot construct AbstractOtherContractDAO instance directly'))
  })

  it('should have unavailable/empty interface methods', () => {
    const error = new Error('should be overridden')
    expect(() => {
      AbstractOtherContractDAO.getTypeName()
    }).toThrow(error)
    expect(() => {
      AbstractOtherContractDAO.getJson()
    }).toThrow(error)
    expect(() => {
      AbstractOtherContractDAO.getContractModel()
    }).toThrow(error)

    class OtherContractDAO extends AbstractOtherContractDAO {}
    const dao = new OtherContractDAO(require('../../src/contracts/Exchange.json'))
    expect(() => {
      dao.initContractModel().then()
    }).toThrow(error)

    return dao.retrieveSettings().then(r => {
      expect(r).toEqual({})

      return dao.saveSettings(null, null)
    }).then(r => {
      expect(r).toBeTruthy()
    })
  })
})
