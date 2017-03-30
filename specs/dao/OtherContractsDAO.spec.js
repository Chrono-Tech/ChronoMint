import TimeProxyDAO from '../../src/dao/TimeProxyDAO'
import OtherContractsDAO from '../../src/dao/OtherContractsDAO'

describe('Other Contracts DAO', () => {
  it('should show more then 10000 time balance', () => {
    return OtherContractsDAO.contract.then(contractsManager =>
            TimeProxyDAO.getAccountBalance(contractsManager.address).then(balance => {
              expect(+balance).toBeGreaterThan(10000)
            })
        )
  })
})
