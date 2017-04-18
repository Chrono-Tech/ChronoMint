import TIMEProxyDAO from '../../src/dao/TIMEProxyDAO'
import OtherContractsDAO from '../../src/dao/OtherContractsDAO'

describe('Other Contracts DAO', () => {
  it('should show more then 10000 time balance', () => {
    return OtherContractsDAO.contract.then(contractsManager =>
      TIMEProxyDAO.getAccountBalance(contractsManager.address).then(balance => {
        expect(+balance).toBeGreaterThan(10000)
      })
    )
  })
})
