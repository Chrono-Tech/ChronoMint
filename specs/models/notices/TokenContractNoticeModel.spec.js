import TokenContractNoticeModel from '../../../src/models/notices/TokenContractNoticeModel'
import TokenContractModel from '../../../src/models/contracts/TokenContractModel'

describe('token contract notice', () => {
  it('should construct and return message', () => {
    const model = new TokenContractNoticeModel({token: new TokenContractModel()})
    expect(model.message().length).toBeGreaterThan(3)
  })
})
