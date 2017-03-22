import CBENoticeModel from '../../../src/models/notices/CBENoticeModel';
import CBEModel from '../../../src/models/CBEModel';

const model = new CBENoticeModel({cbe: new CBEModel()});

describe('cbe notice', () => {
    it('should return message', () => {
        expect(model.message().length).toBeGreaterThan(3);
    });

    it('should return date', () => {
        expect(model.date().length).toBeGreaterThan(3);
    });
});