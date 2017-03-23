import OtherContractNoticeModel from '../../../src/models/notices/OtherContractNoticeModel';
import ExchangeContractModel from '../../../src/models/contracts/ExchangeContractModel';

describe('other contract notice', () => {
    it('should construct and return message', () => {
        const model = new OtherContractNoticeModel({contract: new ExchangeContractModel()});
        expect(model.message().length).toBeGreaterThan(3);
    });
});